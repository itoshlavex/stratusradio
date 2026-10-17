package io.ololiohill.stratusradio;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.ServiceCompat;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * The "now playing" notification, which Android also shows on the lock screen.
 *
 * It shows the station, the song when the station sends one, and its logo, with
 * previous, play/pause and next. It doesn't play anything itself: the radio plays
 * in the site's page, and the buttons are passed back to it through
 * NowPlayingPlugin. Being a media foreground service while the radio plays also
 * tells Android the app is in use, so it isn't closed in the background.
 */
public class PlaybackService extends Service {

    static final String ACTION_UPDATE = "io.ololiohill.stratusradio.UPDATE";
    static final String ACTION_DISMISS = "io.ololiohill.stratusradio.DISMISS";
    private static final String ACTION_PLAY = "io.ololiohill.stratusradio.PLAY";
    private static final String ACTION_PAUSE = "io.ololiohill.stratusradio.PAUSE";
    private static final String ACTION_NEXT = "io.ololiohill.stratusradio.NEXT";
    private static final String ACTION_PREVIOUS = "io.ololiohill.stratusradio.PREVIOUS";

    private static final String CHANNEL = "playback";
    private static final int NOTIFICATION_ID = 1;

    /** Set as soon as the service is asked to start, cleared as soon as it is told to stop. */
    static volatile boolean running;

    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService loader = Executors.newSingleThreadExecutor();
    private MediaSessionCompat session;
    private boolean foreground;

    private String state = "loading";
    private String station = "";
    private String title = "";
    private String detail = "";
    private String artworkUrl = "";
    private String artworkFor;   // the URL the bitmap below came from
    private Bitmap artwork;
    private String artworkLoading;

    @Override
    public void onCreate() {
        super.onCreate();
        running = true;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(CHANNEL, getString(R.string.playback_channel), NotificationManager.IMPORTANCE_LOW);
            channel.setShowBadge(false);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
        session = new MediaSessionCompat(this, "StratusRadio");
        session.setCallback(new MediaSessionCompat.Callback() {
            @Override public void onPlay() { NowPlayingPlugin.control("play"); }
            @Override public void onPause() { NowPlayingPlugin.control("pause"); }
            @Override public void onStop() { NowPlayingPlugin.control("pause"); }
            @Override public void onSkipToNext() { NowPlayingPlugin.control("next"); }
            @Override public void onSkipToPrevious() { NowPlayingPlugin.control("previous"); }
        });
        session.setSessionActivity(openApp());
        session.setActive(true);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? null : intent.getAction();
        if (ACTION_UPDATE.equals(action)) {
            state = extra(intent, "state");
            station = extra(intent, "station");
            title = extra(intent, "title");
            detail = extra(intent, "detail");
            artworkUrl = extra(intent, "artwork");
            show();
        } else if (ACTION_PLAY.equals(action)) {
            NowPlayingPlugin.control("play");
        } else if (ACTION_PAUSE.equals(action)) {
            NowPlayingPlugin.control("pause");
        } else if (ACTION_NEXT.equals(action)) {
            NowPlayingPlugin.control("next");
        } else if (ACTION_PREVIOUS.equals(action)) {
            NowPlayingPlugin.control("previous");
        } else if (ACTION_DISMISS.equals(action)) {
            // Swiped away (only possible while paused), or the app is closing.
            NowPlayingPlugin.control("pause");
            stop();
        } else {
            // Restarted by Android after it closed the app: there is no radio to show.
            stop();
        }
        return START_NOT_STICKY;
    }

    private void show() {
        if ("stopped".equals(state)) {
            stop();
            return;
        }
        boolean active = "playing".equals(state) || "loading".equals(state);
        updateSession();
        Notification notification = build(active);
        if (active) {
            try {
                if (Build.VERSION.SDK_INT >= 29) {
                    startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
                } else {
                    startForeground(NOTIFICATION_ID, notification);
                }
                foreground = true;
            } catch (RuntimeException e) {
                // Android 12+ can refuse when playing resumes from the background
                // (say, from a headset button). The notification still shows.
                post(notification);
            }
        } else {
            // Paused: the notification stays, with a play button, but can be swiped away.
            if (foreground) {
                ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_DETACH);
                foreground = false;
            }
            post(notification);
        }
        loadArtwork();
    }

    /** The two lines: the song and the station, or the station and how it's going. */
    private String line1() {
        return title.isEmpty() ? station : title;
    }

    private String line2() {
        if (!title.isEmpty()) return station;
        if ("loading".equals(state)) return "Connecting…";
        if ("paused".equals(state)) return "Paused";
        return detail.isEmpty() ? "Live" : detail;
    }

    private Bitmap appIcon;

    private Bitmap art() {
        if (artwork != null && artworkUrl.equals(artworkFor)) return artwork;
        if (appIcon == null) appIcon = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher_foreground);
        return appIcon;
    }

    private void updateSession() {
        int playback = "playing".equals(state) ? PlaybackStateCompat.STATE_PLAYING
            : "loading".equals(state) ? PlaybackStateCompat.STATE_BUFFERING
            : PlaybackStateCompat.STATE_PAUSED;
        session.setPlaybackState(new PlaybackStateCompat.Builder()
            .setActions(PlaybackStateCompat.ACTION_PLAY | PlaybackStateCompat.ACTION_PAUSE
                | PlaybackStateCompat.ACTION_PLAY_PAUSE | PlaybackStateCompat.ACTION_STOP
                | PlaybackStateCompat.ACTION_SKIP_TO_NEXT | PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)
            .setState(playback, PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, playback == PlaybackStateCompat.STATE_PLAYING ? 1f : 0f)
            .build());
        session.setMetadata(new MediaMetadataCompat.Builder()
            .putString(MediaMetadataCompat.METADATA_KEY_TITLE, line1())
            .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, line2())
            .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, "Stratus Radio")
            .putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, art())
            .build());
    }

    private Notification build(boolean active) {
        return new NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_radio)
            .setContentTitle(line1())
            .setContentText(line2())
            .setLargeIcon(art())
            .setContentIntent(openApp())
            .setDeleteIntent(command(ACTION_DISMISS))
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)   // shown in full on the lock screen
            .setCategory(NotificationCompat.CATEGORY_TRANSPORT)
            .setColor(0xFF021A4F)
            .setOnlyAlertOnce(true)
            .setShowWhen(false)
            .setOngoing(active)
            .addAction(R.drawable.ic_previous, "Previous", command(ACTION_PREVIOUS))
            .addAction(active ? R.drawable.ic_pause : R.drawable.ic_play, active ? "Pause" : "Play",
                command(active ? ACTION_PAUSE : ACTION_PLAY))
            .addAction(R.drawable.ic_next, "Next", command(ACTION_NEXT))
            .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                .setMediaSession(session.getSessionToken())
                .setShowActionsInCompactView(0, 1, 2))
            .build();
    }

    // A media notification needs no notification permission (Android 13+ lets them through).
    @SuppressLint("MissingPermission")
    private void post(Notification notification) {
        NotificationManagerCompat.from(this).notify(NOTIFICATION_ID, notification);
    }

    /** Fetches the station's logo once, then redraws the notification with it. */
    private void loadArtwork() {
        final String url = artworkUrl;
        if (url.isEmpty() || url.equals(artworkFor) || url.equals(artworkLoading)) return;
        artworkLoading = url;
        loader.execute(() -> {
            Bitmap bitmap = fetch(url);
            main.post(() -> {
                if (url.equals(artworkLoading)) artworkLoading = null;
                if (!running || !url.equals(artworkUrl)) return;
                artworkFor = url;
                artwork = bitmap;
                if (bitmap != null) show();
            });
        });
    }

    private static Bitmap fetch(String url) {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(8000);
            try (InputStream in = connection.getInputStream()) {
                return BitmapFactory.decodeStream(in);
            }
        } catch (Exception e) {
            return null;
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    private PendingIntent openApp() {
        Intent intent = new Intent(this, MainActivity.class)
            .setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        return PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private PendingIntent command(String action) {
        Intent intent = new Intent(this, PlaybackService.class).setAction(action);
        return PendingIntent.getService(this, action.hashCode(), intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private static String extra(Intent intent, String key) {
        String value = intent.getStringExtra(key);
        return value == null ? "" : value;
    }

    private void stop() {
        running = false;
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE);
        foreground = false;
        NotificationManagerCompat.from(this).cancel(NOTIFICATION_ID);
        stopSelf();
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        // The app was swiped away, and the radio playing in it is gone.
        stop();
        super.onTaskRemoved(rootIntent);
    }

    @Override
    public void onDestroy() {
        // running is left alone here: it was cleared by stop(), and a new start may already have set it again.
        main.removeCallbacksAndMessages(null);
        loader.shutdownNow();
        session.setActive(false);
        session.release();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
