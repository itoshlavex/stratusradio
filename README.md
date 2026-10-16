# Stratus Radio

Listen to Papua New Guinea radio stations online. Stratus Radio is a web app: it runs in any phone or computer browser, and you can install it on a phone's home screen.

## Features

- 11 built-in stations: Yumi FM, Legend FM, Nau FM, FM100, NBC National Radio, Wantok Radio Light, Radio Maria PNG, Laif FM, Life Worship, ABC Radio Australia and RNZ Pacific.
- More PNG stations are added automatically from the free [Radio Browser](https://www.radio-browser.info/) directory.
- Search by station, town or language, and filter by Music, News & talk, Christian or Pacific.
- Favourites, saved on each phone.
- Keeps playing with the screen locked. Play, pause and change station from the lock screen or headphones.
- Sleep timer: 15 minutes to 2 hours, with a short fade-out.
- Reconnects on its own when the signal drops.
- Shows the time in PNG.

## Put it online with GitHub Pages (free)

1. Unzip `stratusradio.zip`.
2. Open your `stratusradio` repository on github.com and choose **uploading an existing file** (or **Add file → Upload files**).
3. Select all 13 files, put them at the top level of the repo (not inside a folder), then tap **Commit changes**. Uploading a file with the same name as one already there replaces it.
4. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, then tap **Save**.
5. After a minute or two the app is live at `https://YOUR-USERNAME.github.io/stratusradio/`.

On a phone, open that link and use **Add to Home Screen** (iPhone: Share → Add to Home Screen; Android: the Install button in the app or the browser menu).

## Adding or fixing a station

Stations are listed in `stations.js`. Copy a block, give it a new `id`, and paste the station's direct stream address in `stream`. That's the address that plays audio, not the station's web page. You can list several addresses, and the app tries them in order.

The stream addresses came from each station's own website or player where possible, plus radio directories. Stations change their stream addresses from time to time, so if one stops working, check its website for a new player.

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
