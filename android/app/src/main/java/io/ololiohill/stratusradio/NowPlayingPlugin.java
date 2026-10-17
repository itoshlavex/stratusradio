package io.ololiohill.stratusradio;

import android.content.Context;
import android.content.Intent;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Lets the site (app.js) show what is playing in a notification and on the lock
 * screen, and hears back when someone taps play, pause, next or previous there.
 *
 * The radio itself plays in the site's web page, as it does in a browser. app.js
 * calls Capacitor.nativePromise('NowPlaying', 'update', {...}) whenever the player
 * changes, and listens for 'control' events.
 */
@CapacitorPlugin(name = "NowPlaying")
public class NowPlayingPlugin extends Plugin {

    private static NowPlayingPlugin instance;

    @Override
    public void load() {
        instance = this;
    }

    /** state: playing | loading | paused | stopped; station, title (the song), detail, artwork (a URL). */
    @PluginMethod
    public void update(PluginCall call) {
        String state = call.getString("state", "stopped");
        boolean active = "playing".equals(state) || "loading".equals(state);
        Context context = getContext();
        Intent intent = new Intent(context, PlaybackService.class)
            .setAction(PlaybackService.ACTION_UPDATE)
            .putExtra("state", state)
            .putExtra("station", call.getString("station", ""))
            .putExtra("title", call.getString("title", ""))
            .putExtra("detail", call.getString("detail", ""))
            .putExtra("artwork", call.getString("artwork", ""));
        if (PlaybackService.running) {
            context.startService(intent);
        } else if (active) {
            // Only playing starts the notification; a pause or stop with none showing is nothing to do.
            PlaybackService.running = true;
            ContextCompat.startForegroundService(context, intent);
        }
        call.resolve();
    }

    /** A button on the notification or lock screen: play, pause, next or previous. */
    static void control(String action) {
        NowPlayingPlugin plugin = instance;
        if (plugin == null) return;
        JSObject data = new JSObject();
        data.put("action", action);
        plugin.notifyListeners("control", data);
    }

    @Override
    protected void handleOnDestroy() {
        // The app is closing and the radio with it: take the notification away.
        instance = null;
        if (PlaybackService.running) {
            try {
                getContext().startService(new Intent(getContext(), PlaybackService.class).setAction(PlaybackService.ACTION_DISMISS));
            } catch (RuntimeException e) {
                // Android can refuse to start services from the background; the
                // service ends with the app's task anyway (onTaskRemoved).
            }
        }
    }
}
