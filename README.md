# Stratus Radio

Live radio from across the Pacific, by [Ololio Hill Technologies](https://ololiohill.io/). Stratus Radio is a web app: it runs in any phone or computer browser, and you can install it on a phone's home screen.

## Features

- Stations from Papua New Guinea and across the Pacific, plus New Zealand and Australia (Pacific, Torres Strait and First Nations stations, public radio and the main networks), RNZ Pacific and ABC Radio Australia. Every stream in the list has been checked to play.
- Choose a country, filter by Music, News & talk or Christian, or search by station, town, country or language.
- Favourites, saved on each phone.
- Share the app: the paper-plane button at the top shares the link to Stratus Radio itself.
- Share a station: the paper-plane button beside each station sends a short link, like `https://stratusradio.ololiohill.io/yumi-fm`, that opens Stratus Radio with that station ready to play. The part after the `/` is the station's `id` in `stations.js`.
- Light mode by default; tap the button in the header to switch to dark (the choice is remembered).
- Keeps playing with the screen locked. Play, pause and change station from the lock screen or headphones.
- Sleep timer: 15 minutes to 2 hours, or a custom time in hours and minutes, with a short fade-out.
- Reconnects on its own when the signal drops.
- Shows the song or programme on air, for stations that send it, in the player and on the lock screen.

## Where it lives

The app is hosted free on Cloudflare at **https://stratusradio.ololiohill.io**.

Cloudflare is linked to this GitHub repository. Every change to the `main` branch goes live on its own, usually within a minute. To update the app, change the files on `main`, either by editing them on github.com or with **Add file → Upload files** (keep files at the top level, not inside a folder; a file with the same name replaces the old one). Changes on any other branch get their own preview link instead, so you can check them first.

On a phone, open the link and use **Add to Home Screen** (iPhone: Share → Add to Home Screen; Android: the Install button in the app or the browser menu).

### Cloudflare setup (already done)

Kept here in case it ever needs doing again.

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com) with the account that has the `ololiohill.io` domain.
2. Open **Workers & Pages**, tap **Create application**, and choose the **GitHub** option (it may say **Import a repository**).
3. When asked, sign in to GitHub and allow Cloudflare to see the `stratusradio` repository.
4. Pick the `stratusradio` repository. Keep the project name as `stratusradio`: it must match `name` in `wrangler.jsonc` or the deploy fails. Leave the build command empty and keep the deploy command `npx wrangler deploy`, the branch `main` and the root directory `/`.
5. Tap **Save and Deploy**.

The first deploy also sets up `stratusradio.ololiohill.io`: Cloudflare adds the DNS record and the HTTPS certificate itself. The address can take a few minutes to start working. Deploy logs are under the Worker's **Deployments** tab.

If the deploy says the custom domain couldn't be added, check that `ololiohill.io` is in the same Cloudflare account and that there's no existing DNS record for `stratusradio`. You can also add the domain by hand in the Worker's **Settings → Domains & Routes**.

## Adding or fixing a station

Stations are listed in `stations.js`. Copy a block, give it a new `id`, and paste the station's direct stream address in `stream`. For its logo, add a square image named after the `id` to the `logos` folder, for example `logos/yumi-fm.webp` (256 × 256 pixels in WebP format works well). Without a logo, the tile shows the station's frequency instead. Phones keep logos for a long time, so if you replace an existing logo, also raise `LOGO_VERSION` near the top of the logo code in `app.js` (for example from 1 to 2) so everyone gets the new one. That's the address that plays audio, not the station's web page. You can list several addresses, and the app tries them in order.

The stream addresses came from each station's own website or player where possible. The address must start with `https://`, because the app is served over HTTPS and phones block plain `http://` streams on it. Stations change their stream addresses from time to time, so if one stops working, check its website for a new player.

## The Android app

`download/stratusradio.apk`, served at https://stratusradio.ololiohill.io/download/stratusradio.apk. Package `io.ololiohill.stratusradio`, Android 7.0 and newer. Android phones see a small "App" button beside the company name at the bottom of the page; iPhones and computers don't, since they can't install it.

- **It opens the live site in the phone's Chrome**, full screen with no address bar (a Trusted Web Activity, built on Google's Android Browser Helper). Chrome does the playing, so the radio keeps going with the screen off and has play/pause on the lock screen. Changes to the site reach the app straight away: rebuild the APK only for a new icon, name or version.
- **Chrome hides the address bar only because** `.well-known/assetlinks.json` lists the app's package and signing certificate. Don't remove or change that file.
- **Release it from the Actions tab:** run the **APK** workflow and type a version, like `1.0.1`. It builds, signs, checks the certificate against `assetlinks.json`, counts `versionCode` up and commits the new APK to `main`, and Cloudflare publishes it.
- **The signing key** is in two Actions secrets, `ANDROID_KEYSTORE_BASE64` and `ANDROID_KEYSTORE_PASSWORD`, and in the owner's own backup. It is never in the repo. Android installs an update only if it is signed with the same key, so if the key is lost, everyone has to uninstall the app before they can get a newer one.
- **The certificate** (SHA-256) is `ED:B0:49:10:CB:DF:3F:CD:4A:89:D0:EC:D4:86:69:BB:8E:06:EF:D9:C2:6F:A8:18:11:E1:09:55:89:45:3E:C6`, `CN=Stratus Radio, O=Ololio Hill Technologies`.
- Shipped: 1.0 / versionCode 1 (17 October 2026).

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page |
| `app.css` | Styles (light and dark mode) |
| `app.js` | Player, search, favourites, sleep timer, lock-screen controls |
| `stations.js` | Built-in station list |
| `sw.js` | Lets the app open when offline |
| `manifest.webmanifest` | Home-screen app name and colours |
| `logo.png`, `icon-*.png`, `apple-touch-icon.png`, `favicon-32.png` | Stratus Radio logo and app icons |
| `og-image.jpg` | The picture shown when the app's link is shared in WhatsApp, Facebook and other apps |
| `android/` | The Android app (see above) |
| `download/stratusradio.apk` | The built Android app |
| `.well-known/assetlinks.json` | Tells Chrome the Android app belongs to this site |
| `_headers` | Tells Cloudflare phones may keep the station logos for a long time |
| `logos/` | Station logos, one square image per station, named after the station's `id` |
| `worker.js` | Small Cloudflare helper behind `/api/now`: reads the song name a station sends inside its stream (browsers can't), so the app can show it |
| `wrangler.jsonc` | Cloudflare hosting settings, including the `stratusradio.ololiohill.io` address |
| `.assetsignore` | Files in the repo that Cloudflare keeps off the website (including `android/`) |
| `.gitignore` | Files Git leaves out of the repo |
