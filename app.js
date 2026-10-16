/* Stratus Radio: player, station list, favourites, sleep timer, lock-screen controls. */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var KEY = 'stratus:';
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ }
    }
  };

  var CATS = [
    { id: 'all', label: 'All' },
    { id: 'fav', label: 'Favourites' },
    { id: 'music', label: 'Music' },
    { id: 'news', label: 'News & talk' },
    { id: 'christian', label: 'Christian' }
  ];
  // Country code, chip label, place name shown on rows (empty = city already says it).
  var COUNTRIES = [
    ['PG', 'PNG', 'PNG'], ['FJ', 'Fiji', 'Fiji'], ['SB', 'Solomon Is.', 'Solomon Islands'],
    ['VU', 'Vanuatu', 'Vanuatu'], ['NC', 'New Caledonia', 'New Caledonia'], ['WS', 'Samoa', 'Samoa'],
    ['AS', 'American Samoa', 'American Samoa'], ['TO', 'Tonga', 'Tonga'], ['PF', 'French Polynesia', 'French Polynesia'],
    ['WF', 'Wallis & Futuna', 'Wallis and Futuna'], ['CK', 'Cook Is.', 'Cook Islands'], ['NU', 'Niue', 'Niue'],
    ['TK', 'Tokelau', 'Tokelau'], ['TV', 'Tuvalu', 'Tuvalu'], ['KI', 'Kiribati', 'Kiribati'], ['NR', 'Nauru', 'Nauru'],
    ['MH', 'Marshall Is.', 'Marshall Islands'], ['FM', 'Micronesia', 'Micronesia'], ['PW', 'Palau', 'Palau'],
    ['GU', 'Guam', 'Guam'], ['MP', 'N. Marianas', 'Northern Mariana Islands'],
    ['NZ', 'NZ Pacific', 'NZ'], ['XP', 'Pacific-wide', '']
  ];
  var COUNTRY = {};
  COUNTRIES.forEach(function (c, i) { COUNTRY[c[0]] = { code: c[0], label: c[1], place: c[2], order: i }; });
  // Countries looked up in the Radio Browser directory (not NZ: its hundreds of stations would bury the Pacific ones).
  var DIR_COUNTRIES = COUNTRIES.map(function (c) { return c[0]; }).filter(function (c) { return c !== 'NZ' && c !== 'XP'; });
  var RB_HOSTS = [
    'https://de1.api.radio-browser.info',
    'https://de2.api.radio-browser.info',
    'https://fi1.api.radio-browser.info',
    'https://all.api.radio-browser.info'
  ];
  var HLS_JS = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
  var TILES = ['navy', 'royal', 'bright', 'sky', 'ice', 'deep'];
  var MAX_RETRIES = 8;          // reconnect attempts after a stream drops (about 2.5 minutes)
  var CONNECT_TIMEOUT = 15000;  // give a stream this long to start
  var STALL_TIMEOUT = 20000;    // buffering longer than this triggers a reconnect
  var PAUSE_RELEASE = 5 * 60000; // close the connection after 5 minutes paused

  var el = {
    list: $('#list'), chips: $('#chips'), q: $('#q'), count: $('#count'),
    empty: $('#empty'), emptyTitle: $('#empty-title'), emptyBody: $('#empty-body'),
    player: $('#player'), pTile: $('#p-tile'), pName: $('#p-name'), pStatus: $('#p-status'), pHelp: $('#p-help'),
    playBtn: $('#play-btn'), sleepBtn: $('#sleep-btn'), sleepLeft: $('#sleep-left'),
    sheet: $('#sleep-sheet'), sleepGrid: $('#sleep-grid'), sleepSub: $('#sleep-sub'), sleepOff: $('#sleep-off'),
    countries: $('#countries'), dirStatus: $('#dir-status'),
    install: $('#install'), installBtn: $('#install-btn'), installIos: $('#install-ios')
  };
  var audio = $('#audio');

  /* ---------- Stations ---------- */

  var builtIn = (window.STRATUS_STATIONS || []).map(function (s) {
    var st = Object.assign({ source: 'built-in', cats: [], tile: 'navy' }, s);
    st.baseStream = (s.stream || []).slice();
    st.stream = st.baseStream.slice();
    return st;
  });
  var directory = [];
  var rbHost = '';

  function allStations() { return builtIn.concat(directory); }
  function byId(id) {
    var list = allStations();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  var favs = new Set(store.get('favs', []));
  var filter = store.get('filter', 'all');
  if (!CATS.some(function (c) { return c.id === filter; })) filter = 'all';
  var country = store.get('country', 'all');
  if (country !== 'all' && !COUNTRY[country]) country = 'all';
  var query = '';

  /* ---------- Helpers ---------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function initials(name) {
    var words = String(name || '').replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    var skip = { radio: 1, the: 1, fm: 1, png: 1 };
    var keep = words.filter(function (w) { return !skip[w.toLowerCase()]; });
    var src = keep.length ? keep : words;
    if (src.length === 1) return src[0].slice(0, 3).toUpperCase();
    return src.slice(0, 3).map(function (w) { return w[0]; }).join('').toUpperCase();
  }
  function titleCase(s) {
    return String(s || '').trim().replace(/\b([a-z])/g, function (m) { return m.toUpperCase(); });
  }
  function hashPick(s, arr) {
    var h = 0; s = String(s);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return arr[Math.abs(h) % arr.length];
  }
  function uniq(list) {
    var seen = {};
    return list.filter(function (u) { if (!u || seen[u]) return false; seen[u] = 1; return true; });
  }
  // On an https page, try the https version of an http stream first.
  function withHttps(list) {
    if (location.protocol !== 'https:') return uniq(list);
    var out = [];
    list.forEach(function (u) {
      if (/^http:\/\//i.test(u)) out.push('https://' + u.slice(7));
      out.push(u);
    });
    return uniq(out);
  }
  function sameUrl(a, b) {
    return String(a || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '') ===
      String(b || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  }
  function parseFreq(freq) {
    var m = /^\s*([\d.]+)\s*(FM|AM|MHz|kHz)?/i.exec(freq || '');
    return m ? { num: m[1], band: (m[2] || 'FM').toUpperCase() } : null;
  }
  function fetchJSON(url, ms) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 8000);
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .finally(function () { clearTimeout(t); });
  }
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* ---------- Rendering ---------- */

  function tileHTML(st) {
    var f = parseFreq(st.freq);
    if (f) return '<span class="tile-freq' + (f.num.length > 4 ? ' is-long' : '') + '">' + esc(f.num) + '</span><span class="tile-band">' + esc(f.band) + '</span>';
    return '<span class="tile-short">' + esc(st.short || initials(st.name)) + '</span>';
  }
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  function rowHTML(st) {
    var fav = favs.has(st.id);
    var places = placeOf(st) + (st.also ? ' \u00b7 also ' + st.also : '');
    var meta = [st.lang, places].filter(Boolean).join(' · ');
    var badge = st.source === 'directory' ? '<span class="badge">Directory</span>' : '';
    return '<li class="st" data-id="' + esc(st.id) + '">' +
      '<button class="st-main" type="button" aria-label="Play ' + esc(st.name) + '">' +
        '<span class="tile t-' + esc(st.tile) + '" aria-hidden="true">' + tileHTML(st) + '</span>' +
        '<span class="st-text">' +
          '<span class="st-name">' + esc(st.name) + badge + '</span>' +
          (meta ? '<span class="st-meta">' + esc(meta) + '</span>' : '') +
          (st.desc ? '<span class="st-desc">' + esc(st.desc) + '</span>' : '') +
        '</span>' +
        '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '</button>' +
      '<button class="fav" type="button" aria-pressed="' + fav + '" aria-label="' +
        (fav ? 'Remove ' : 'Add ') + esc(st.name) + (fav ? ' from' : ' to') + ' favourites">' + STAR + '</button>' +
    '</li>';
  }

  function placeOf(st) {
    var c = COUNTRY[st.country];
    var city = st.city || '';
    if (!c || !c.place || c.place === city) return city;
    return city ? city + ', ' + c.place : c.place;
  }

  function matches(st) {
    if (country !== 'all' && st.country !== country) return false;
    if (filter === 'fav' && !favs.has(st.id)) return false;
    if (filter !== 'all' && filter !== 'fav' && (st.cats || []).indexOf(filter) < 0) return false;
    if (!query) return true;
    var c = COUNTRY[st.country] || {};
    var hay = [st.name, st.freq, st.city, st.also, st.lang, st.desc, st.tags, st.short, c.label, c.place].join(' ').toLowerCase();
    return query.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function renderCountries() {
    var counts = {};
    allStations().forEach(function (st) { counts[st.country] = (counts[st.country] || 0) + 1; });
    var codes = Object.keys(counts).filter(function (k) { return COUNTRY[k]; })
      .sort(function (a, b) { return COUNTRY[a].order - COUNTRY[b].order; });
    if (country !== 'all' && !counts[country]) country = 'all';
    var html = '<button class="chip" type="button" data-country="all" aria-pressed="' + (country === 'all') + '">All Pacific</button>';
    html += codes.map(function (k) {
      return '<button class="chip" type="button" data-country="' + k + '" aria-pressed="' + (country === k) + '">' +
        esc(COUNTRY[k].label) + '<span class="n">' + counts[k] + '</span></button>';
    }).join('');
    el.countries.innerHTML = html;
  }

  function renderChips() {
    el.chips.innerHTML = CATS.map(function (c) {
      var n = c.id === 'fav' && favs.size ? '<span class="n">' + favs.size + '</span>' : '';
      return '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="' + (filter === c.id) + '">' + esc(c.label) + n + '</button>';
    }).join('');
  }

  function renderList() {
    var list = allStations().filter(matches);
    el.list.innerHTML = list.map(rowHTML).join('');
    var n = list.length;
    var noun = filter === 'fav' ? (n === 1 ? 'favourite' : 'favourites') : (n === 1 ? 'station' : 'stations');
    el.count.textContent = query ? n + ' ' + noun + ' match “' + query + '”' : n + ' ' + noun;
    el.count.hidden = n === 0;
    el.empty.hidden = n > 0;
    if (!n) {
      if (filter === 'fav' && !favs.size) {
        el.emptyTitle.textContent = 'No favourites yet';
        el.emptyBody.textContent = 'Tap the star next to a station to keep it here.';
      } else {
        el.emptyTitle.textContent = 'No stations match';
        el.emptyBody.textContent = query ? 'Try another word, or clear the search.' : 'Try another type of station or another country.';
      }
    }
    syncRows();
  }

  function syncRows() {
    var rows = el.list.querySelectorAll('.st');
    for (var i = 0; i < rows.length; i++) {
      var isCur = !!current && rows[i].getAttribute('data-id') === current.id;
      rows[i].classList.toggle('is-current', isCur);
      rows[i].classList.toggle('is-live', isCur && state === 'live');
    }
  }

  /* ---------- Player state ---------- */

  var current = null;
  var state = 'idle'; // idle | connecting | live | buffering | reconnecting | paused | offline | error
  var wantPlaying = false;
  var streamOn = false;
  var urls = [];
  var urlIndex = 0;
  var goodIndex = -1;
  var retries = 0;
  var passes = 0;
  var attempt = 0;
  var handled = -1;
  var playToken = 0;
  var timers = { retry: 0, connect: 0, stall: 0, release: 0, np: 0 };
  var nowPlaying = '';
  var stoppedBySleep = false;
  var hls = null;
  var unlocked = false;

  function isActive() { return state === 'connecting' || state === 'buffering' || state === 'live' || state === 'reconnecting'; }

  function setState(s) {
    state = s;
    renderPlayer();
    syncRows();
    if ('mediaSession' in navigator) {
      try { navigator.mediaSession.playbackState = isActive() ? 'playing' : (current ? 'paused' : 'none'); } catch (e) {}
    }
    document.title = current && isActive() ? current.name + ' – Stratus Radio' : 'Stratus Radio';
  }

  function renderPlayer() {
    el.player.setAttribute('data-state', state);
    el.playBtn.disabled = !current;
    el.pHelp.hidden = true;
    if (!current) {
      el.pTile.className = 'tile tile-sm';
      el.pTile.innerHTML = '';
      el.pName.textContent = 'Pick a station';
      el.pStatus.textContent = 'Tap any station to start listening';
      el.playBtn.setAttribute('aria-label', 'Play');
      return;
    }
    el.pTile.className = 'tile tile-sm t-' + current.tile;
    el.pTile.innerHTML = tileHTML(current);
    el.pName.textContent = current.name;
    el.playBtn.setAttribute('aria-label', isActive() ? 'Pause ' + current.name : 'Play ' + current.name);

    var where = [current.freq, placeOf(current)].filter(Boolean).join(' · ');
    var html;
    switch (state) {
      case 'connecting': html = 'Connecting…'; break;
      case 'buffering': html = 'Weak signal, buffering…'; break;
      case 'live': html = '<span class="live-dot"></span>' + (nowPlaying ? esc(nowPlaying) : 'Live' + (where ? ' · ' + esc(where) : '')); break;
      case 'reconnecting': html = 'Signal dropped. Reconnecting (' + retries + ' of ' + MAX_RETRIES + ')…'; break;
      case 'paused': html = stoppedBySleep ? 'Stopped by the sleep timer' : 'Paused'; break;
      case 'offline': html = 'No internet. It will start again when you’re back online.'; break;
      case 'error':
        html = 'Can’t reach this station right now';
        el.pHelp.innerHTML = 'It may be off air or having power problems. Try again later' +
          (current.homepage ? ', or <a href="' + esc(current.homepage) + '" target="_blank" rel="noopener">open the station’s website</a>.' : '.');
        el.pHelp.hidden = false;
        break;
      default: html = 'Tap play to listen' + (where ? ' · ' + esc(where) : '');
    }
    el.pStatus.innerHTML = html;
  }

  function clearTimers(keepNp) {
    clearTimeout(timers.retry); clearTimeout(timers.connect); clearTimeout(timers.stall); clearTimeout(timers.release);
    if (!keepNp) clearInterval(timers.np);
  }

  function destroyHls() { if (hls) { try { hls.destroy(); } catch (e) {} hls = null; } }

  function teardown() {
    streamOn = false;
    destroyHls();
    try { audio.pause(); } catch (e) {}
    audio.removeAttribute('src');
    try { audio.load(); } catch (e) {}
  }

  // A tiny silent clip played inside the tap, so iPhones allow audio that starts after a network lookup.
  var SILENT = (function () {
    var n = 400, buf = new Uint8Array(44 + n), v = new DataView(buf.buffer);
    function w(o, s) { for (var i = 0; i < s.length; i++) buf[o + i] = s.charCodeAt(i); }
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    w(36, 'data'); v.setUint32(40, n, true);
    for (var i = 0; i < n; i++) buf[44 + i] = 128;
    var s = ''; for (var j = 0; j < buf.length; j++) s += String.fromCharCode(buf[j]);
    return 'data:audio/wav;base64,' + btoa(s);
  })();
  function unlockAudio() {
    if (unlocked || streamOn) return;
    unlocked = true;
    try { audio.src = SILENT; var p = audio.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  function fromSilent() { return (audio.currentSrc || audio.src || '').indexOf('data:') === 0; }

  function playStation(st) {
    if (!st) return;
    if (current && current.id === st.id) { togglePlay(); return; }
    clearTimers();
    teardown();
    current = st;
    store.set('last', st.id);
    nowPlaying = '';
    urls = []; urlIndex = 0; goodIndex = -1; retries = 0; passes = 0;
    updateMediaMeta();
    resume();
  }

  function togglePlay() {
    if (!current) return;
    if (isActive()) pause(); else resume();
  }

  function resume() {
    if (!current) return;
    stoppedBySleep = false;
    wantPlaying = true;
    clearTimers(true);
    if (!navigator.onLine) { teardown(); setState('offline'); return; }
    var token = ++playToken;
    if (state !== 'reconnecting') setState('connecting');
    if (urls.length) { urlIndex = goodIndex >= 0 ? goodIndex : 0; startUrl(token); return; }
    if (current.resolve) unlockAudio();
    var st = current;
    resolveUrls(st).then(function (list) {
      if (token !== playToken || current !== st) return;
      urls = list;
      if (!urls.length) { fail(); return; }
      urlIndex = 0;
      startUrl(token);
    });
  }

  function pause() {
    wantPlaying = false;
    clearTimers();
    destroyHls();
    try { audio.pause(); } catch (e) {}
    // Keep the source briefly so lock-screen controls stay; release the connection later.
    timers.release = setTimeout(function () { if (!wantPlaying) teardown(); }, PAUSE_RELEASE);
    setState('paused');
  }

  function fail() {
    wantPlaying = false;
    clearTimers();
    teardown();
    setState('error');
  }

  function startUrl(token) {
    clearTimeout(timers.connect); clearTimeout(timers.stall); clearTimeout(timers.retry);
    destroyHls();
    attempt++;
    var myAttempt = attempt;
    var url = urls[urlIndex];
    streamOn = true;
    var isHls = /\.m3u8(\?|$)/i.test(url);
    if (isHls && !audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.removeAttribute('src');
      loadHls().then(function (Hls) {
        if (token !== playToken || myAttempt !== attempt) return;
        if (!Hls || !Hls.isSupported()) { onStreamError(); return; }
        hls = new Hls();
        hls.on(Hls.Events.ERROR, function (ev, data) { if (data && data.fatal) onStreamError(); });
        hls.loadSource(url);
        hls.attachMedia(audio);
        playPromise();
      });
    } else {
      audio.src = url;
      playPromise();
    }
    timers.connect = setTimeout(function () {
      if (token === playToken && myAttempt === attempt && state !== 'live') onStreamError();
    }, CONNECT_TIMEOUT);
  }

  function playPromise() {
    var p;
    try { p = audio.play(); } catch (e) { onStreamError(); return; }
    if (p && p.catch) p.catch(function (err) {
      if (!err) return;
      if (err.name === 'NotAllowedError') {
        // The browser wants a tap first.
        wantPlaying = false; streamOn = false;
        setState('paused');
      } else if (err.name === 'NotSupportedError') {
        onStreamError();
      }
    });
  }

  function onStreamError() {
    if (!wantPlaying || !current || !streamOn) return;
    if (handled === attempt) return;
    handled = attempt;
    clearTimeout(timers.connect); clearTimeout(timers.stall);

    if (!navigator.onLine) { teardown(); setState('offline'); return; }

    // Still looking for an address that works: try the next one.
    if (goodIndex < 0 && urlIndex < urls.length - 1) { urlIndex++; startUrl(playToken); return; }

    // Never played: give every address one more go, then give up.
    if (goodIndex < 0) {
      if (passes < 1) {
        passes++;
        teardown();
        timers.retry = setTimeout(function () {
          if (!wantPlaying) return;
          urlIndex = 0; startUrl(playToken);
        }, 3000);
        return;
      }
      fail();
      return;
    }

    // It was playing and dropped out: reconnect with growing gaps.
    if (retries < MAX_RETRIES) {
      retries++;
      teardown();
      setState('reconnecting');
      var delay = Math.min(30000, 2000 * Math.pow(2, retries - 1));
      timers.retry = setTimeout(function () {
        if (!wantPlaying) return;
        urlIndex = goodIndex; startUrl(playToken);
      }, delay);
      return;
    }
    fail();
  }

  audio.addEventListener('playing', function () {
    if (!streamOn || fromSilent()) return;
    clearTimeout(timers.connect); clearTimeout(timers.stall);
    goodIndex = urlIndex;
    retries = 0;
    setState('live');
    startNowPlaying();
    countListen(current);
  });
  audio.addEventListener('waiting', function () {
    if (!streamOn || !wantPlaying || fromSilent()) return;
    if (state === 'live') setState('buffering');
    clearTimeout(timers.stall);
    var a = attempt;
    timers.stall = setTimeout(function () {
      if (a === attempt && (state === 'buffering' || state === 'connecting')) onStreamError();
    }, STALL_TIMEOUT);
  });
  audio.addEventListener('error', function () {
    if (!streamOn || fromSilent()) return;
    onStreamError();
  });
  audio.addEventListener('ended', function () {
    if (!streamOn || !wantPlaying || fromSilent()) return;
    onStreamError();
  });
  audio.addEventListener('pause', function () {
    // Paused by the phone (a call, another app, headphones unplugged).
    if (streamOn && wantPlaying && state === 'live' && !fromSilent() && !audio.error && !audio.ended) {
      wantPlaying = false;
      clearTimers();
      timers.release = setTimeout(function () { if (!wantPlaying) teardown(); }, PAUSE_RELEASE);
      setState('paused');
    }
  });
  audio.addEventListener('timeupdate', checkSleep);

  window.addEventListener('online', function () {
    if (wantPlaying && (state === 'offline' || state === 'reconnecting')) {
      retries = 0;
      resume();
    }
  });

  /* ---------- Stream lookup ---------- */

  function resolveUrls(st) {
    var base = (st.stream || []).slice();
    if (!st.resolve || st.resolve.type !== 'azuracast') return Promise.resolve(withHttps(base));
    return fetchJSON(st.resolve.api, 7000).then(function (data) {
      var s = (data && data.station) || {};
      var found = [];
      (s.mounts || []).slice().sort(function (a, b) { return (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0); })
        .forEach(function (m) { if (m && m.url) found.push(m.url); });
      if (s.listen_url) found.push(s.listen_url);
      if (s.hls_url) found.push(s.hls_url);
      applyNowPlaying(st, data);
      return withHttps(found.concat(base));
    }).catch(function () { return withHttps(base); });
  }

  function applyNowPlaying(st, data) {
    if (!current || current.id !== st.id || !data) return;
    var song = data.now_playing && data.now_playing.song;
    var text = '';
    if (song) text = song.text || [song.artist, song.title].filter(Boolean).join(' – ');
    if (!text && data.live && data.live.is_live && data.live.streamer_name) text = 'Live with ' + data.live.streamer_name;
    text = String(text || '').trim().slice(0, 140);
    if (text !== nowPlaying) { nowPlaying = text; renderPlayer(); updateMediaMeta(); }
  }

  function startNowPlaying() {
    clearInterval(timers.np);
    var st = current;
    if (!st || !st.resolve || st.resolve.type !== 'azuracast') return;
    timers.np = setInterval(function () {
      if (current !== st || state !== 'live' || document.hidden) return;
      fetchJSON(st.resolve.api, 7000).then(function (d) { applyNowPlaying(st, d); }).catch(function () {});
    }, 30000);
  }

  var hlsLoading = null;
  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (!hlsLoading) {
      hlsLoading = new Promise(function (res) {
        var s = document.createElement('script');
        s.src = HLS_JS; s.async = true;
        s.onload = function () { res(window.Hls || null); };
        s.onerror = function () { hlsLoading = null; res(null); };
        document.head.appendChild(s);
      });
    }
    return hlsLoading;
  }

  /* ---------- Lock screen (Media Session) ---------- */

  var artCache = {};
  var logoImg = new Image();
  logoImg.onload = function () { artCache = {}; updateMediaMeta(); };
  logoImg.src = 'logo.png';
  function artwork(st) {
    if (artCache[st.id]) return artCache[st.id];
    try {
      var c = document.createElement('canvas'); c.width = c.height = 512;
      var g = c.getContext('2d');
      var root = document.documentElement;
      // Lock-screen art always uses the light palette so it matches the app icon.
      var cs = getComputedStyle(root);
      var bg = cs.getPropertyValue('--art-' + st.tile + '-bg').trim() || '#021A4F';
      var fg = cs.getPropertyValue('--art-' + st.tile + '-fg').trim() || '#18B9FD';
      g.fillStyle = bg; g.fillRect(0, 0, 512, 512);
      // layered cloud bands along the bottom, like the logo
      g.fillStyle = '#18B9FD';
      g.beginPath(); g.moveTo(0, 512); g.lineTo(0, 420);
      g.bezierCurveTo(140, 380, 300, 470, 512, 400); g.lineTo(512, 512); g.closePath(); g.fill();
      g.fillStyle = '#0052F0';
      g.beginPath(); g.moveTo(0, 512); g.lineTo(0, 460);
      g.bezierCurveTo(180, 420, 340, 500, 512, 448); g.lineTo(512, 512); g.closePath(); g.fill();
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
      var f = parseFreq(st.freq);
      g.font = '700 170px Fredoka, "Arial Rounded MT Bold", Arial, sans-serif';
      g.fillText(f ? f.num : (st.short || initials(st.name)), 256, f ? 170 : 200, 440);
      if (f) { g.font = '700 54px "Nunito Sans", Arial, sans-serif'; g.fillText(f.band, 256, 290); }
      if (logoImg.complete && logoImg.naturalWidth) g.drawImage(logoImg, 196, 330, 120, 120);
      artCache[st.id] = c.toDataURL('image/png');
    } catch (e) {
      artCache[st.id] = 'icon-512.png';
    }
    return artCache[st.id];
  }

  function updateMediaMeta() {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined' || !current) return;
    var where = [current.freq, placeOf(current)].filter(Boolean).join(' · ');
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: nowPlaying || current.name,
        artist: nowPlaying ? current.name : (where || 'Live radio'),
        album: 'Stratus Radio',
        artwork: [
          { src: artwork(current), sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    } catch (e) {}
  }

  function step(dir) {
    var pool;
    if (current && favs.has(current.id) && favs.size > 1) {
      pool = allStations().filter(function (s) { return favs.has(s.id); });
    } else {
      pool = allStations().filter(matches);
      if (!pool.length) pool = allStations();
    }
    if (!pool.length) return;
    var i = -1;
    for (var k = 0; k < pool.length; k++) if (current && pool[k].id === current.id) i = k;
    var next = i < 0 ? (dir > 0 ? pool[0] : pool[pool.length - 1]) : pool[(i + dir + pool.length) % pool.length];
    if (next && (!current || next.id !== current.id)) playStation(next);
  }

  if ('mediaSession' in navigator) {
    var setAction = function (a, fn) { try { navigator.mediaSession.setActionHandler(a, fn); } catch (e) {} };
    setAction('play', function () { resume(); });
    setAction('pause', function () { pause(); });
    setAction('stop', function () { pause(); });
    setAction('previoustrack', function () { step(-1); });
    setAction('nexttrack', function () { step(1); });
    setAction('seekbackward', null);
    setAction('seekforward', null);
    setAction('seekto', null);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { artCache = {}; updateMediaMeta(); });
  }

  /* ---------- Sleep timer ---------- */

  var sleepEnd = 0;
  var sleepMin = 0;
  var sleepTick = 0;
  var FADE_MS = 15000;

  function setSleep(min) {
    sleepMin = min || 0;
    sleepEnd = min ? Date.now() + min * 60000 : 0;
    try { audio.volume = 1; } catch (e) {}
    clearInterval(sleepTick);
    if (min) sleepTick = setInterval(checkSleep, 1000);
    renderSleep();
  }

  function checkSleep() {
    if (!sleepEnd) return;
    var left = sleepEnd - Date.now();
    if (left <= 0) {
      sleepEnd = 0; sleepMin = 0;
      clearInterval(sleepTick);
      var wasPlaying = isActive();
      if (wasPlaying) pause();
      try { audio.volume = 1; } catch (e) {}
      stoppedBySleep = wasPlaying;
      renderPlayer();
      renderSleep();
      return;
    }
    if (left < FADE_MS && isActive()) {
      try { audio.volume = Math.max(0.05, left / FADE_MS); } catch (e) {}
    }
    renderSleepBadge(left);
  }

  function fmtLeft(ms) {
    var s = Math.ceil(ms / 1000);
    if (s < 60) return s + 's';
    var m = Math.ceil(s / 60);
    if (m < 60) return m + 'm';
    var h = Math.floor(m / 60), r = m % 60;
    return h + 'h' + (r ? ' ' + r + 'm' : '');
  }
  function clockAt(ts) {
    try { return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; }
  }

  function renderSleepBadge(left) {
    if (!sleepEnd) { el.sleepLeft.hidden = true; el.sleepBtn.classList.remove('is-on'); el.sleepBtn.setAttribute('aria-label', 'Sleep timer'); return; }
    if (left == null) left = sleepEnd - Date.now();
    var label = fmtLeft(left);
    if (el.sleepLeft.textContent !== label) el.sleepLeft.textContent = label;
    el.sleepLeft.hidden = false;
    el.sleepBtn.classList.add('is-on');
    el.sleepBtn.setAttribute('aria-label', 'Sleep timer: stops in ' + label);
  }

  function renderSleep() {
    renderSleepBadge();
    var btns = el.sleepGrid.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', String(!!sleepEnd && Number(btns[i].getAttribute('data-min')) === sleepMin));
    }
    el.sleepOff.hidden = !sleepEnd;
    el.sleepSub.textContent = sleepEnd ? 'The radio stops at ' + clockAt(sleepEnd) + '. Pick a new time to change it.' : 'Stop the radio after';
  }

  function openSheet() {
    renderSleep();
    if (typeof el.sheet.showModal === 'function') { try { el.sheet.showModal(); return; } catch (e) {} }
    el.sheet.setAttribute('open', '');
  }
  function closeSheet() {
    if (typeof el.sheet.close === 'function') { try { el.sheet.close(); return; } catch (e) {} }
    el.sheet.removeAttribute('open');
  }

  /* ---------- Favourites ---------- */

  function toggleFav(st, btn) {
    if (favs.has(st.id)) favs.delete(st.id); else favs.add(st.id);
    store.set('favs', Array.from(favs));
    renderChips();
    if (filter === 'fav') { renderList(); return; }
    if (btn) {
      var on = favs.has(st.id);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + st.name + (on ? ' from' : ' to') + ' favourites');
    }
  }

  /* ---------- Radio Browser directory ---------- */

  function slim(s) {
    if (!s || s.lastcheckok !== 1) return null;
    var url = s.url_resolved || s.url;
    if (!url) return null;
    return {
      uuid: s.stationuuid, name: String(s.name || '').trim(), url: url, url2: s.url,
      cc: String(s.countrycode || '').toUpperCase(),
      tags: s.tags || '', state: s.state || '', lang: s.language || '', homepage: s.homepage || '',
      bitrate: s.bitrate || 0
    };
  }

  // Some directory entries are tagged with every country; drop names that show up in 3 or more.
  var SPAM = /abdul\s*basit|abdulsamad|quran|coran|holy\s*kuran/i;
  function cleanDirectory(list) {
    var where = {};
    list.forEach(function (d) {
      if (!d) return;
      var n = norm(d.name);
      (where[n] = where[n] || {})[d.cc] = 1;
    });
    return list.filter(function (d) {
      return d && d.name && COUNTRY[d.cc] && !SPAM.test(d.name) && Object.keys(where[norm(d.name)]).length < 3;
    });
  }

  function toStation(d) {
    var text = (d.tags + ' ' + d.name).toLowerCase();
    var cats = [];
    if (/christ|gospel|relig|catholic|church|worship|bible|adventist|faith|praise|lotu/.test(text)) cats.push('christian');
    if (/news|talk|information|current affairs/.test(text)) cats.push('news');
    if (/music|pop|hits|rock|reggae|hip ?hop|dance|r&b|country|island|contemporary|oldies/.test(text)) cats.push('music');
    var fm = /(\d{2,3}\.\d)\s*(fm)?/i.exec(d.name);
    var tagList = d.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 3);
    var desc = tagList.length ? titleCase(tagList.join(', ')) : 'Online stream';
    if (d.bitrate) desc += ' · ' + d.bitrate + ' kbps';
    var c = COUNTRY[d.cc];
    return {
      id: 'rb-' + d.uuid, name: d.name, country: d.cc, freq: fm ? fm[1] + ' FM' : '', short: initials(d.name),
      city: titleCase(d.state) || (c ? c.place : ''), lang: titleCase(d.lang), desc: desc, cats: cats,
      tile: hashPick(d.name, TILES), stream: uniq([d.url, d.url2]), homepage: d.homepage,
      tags: d.tags, uuid: d.uuid, source: 'directory'
    };
  }

  function mergeDirectory(list) {
    builtIn.forEach(function (b) { b.stream = b.baseStream.slice(); });
    var out = [], seen = {};
    cleanDirectory(list).forEach(function (d) {
      var n = norm(d.name);
      var key = d.cc + ':' + n;
      if (!n || seen[key]) return;
      var twin = null;
      for (var i = 0; i < builtIn.length && !twin; i++) {
        var b = builtIn[i];
        var urlHit = b.stream.some(function (u) { return sameUrl(u, d.url); });
        var nameHit = b.country === d.cc && (b.match || []).some(function (m) { return n.indexOf(norm(m)) >= 0; });
        if (nameHit || urlHit) twin = b;
      }
      if (twin) {
        // Same station as a built-in one: keep its directory address as a backup.
        if (!twin.stream.some(function (u) { return sameUrl(u, d.url); })) twin.stream.push(d.url);
        return;
      }
      seen[key] = 1;
      out.push(toStation(d));
    });
    out.sort(function (a, b) { return COUNTRY[a.country].order - COUNTRY[b.country].order; });
    directory = out;
    if (!current) restoreLast();
    var link = '<a href="https://www.radio-browser.info/" target="_blank" rel="noopener">Radio Browser</a>';
    el.dirStatus.innerHTML = out.length
      ? 'Also showing ' + out.length + ' more Pacific station' + (out.length === 1 ? '' : 's') + ' from the ' + link + ' community directory, marked “Directory”. Some may be off air.'
      : 'The Pacific stations in the ' + link + ' community directory are already in this list.';
    renderCountries();
    renderList();
  }

  function fetchCountry(host, cc) {
    return fetchJSON(host + '/json/stations/search?countrycode=' + cc + '&hidebroken=true&order=clickcount&reverse=true&limit=100', 9000)
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('bad');
        return data.map(slim).filter(Boolean).map(function (d) { d.cc = d.cc || cc; return d; });
      });
  }

  function loadDirectory() {
    var cached = store.get('dir2', null);
    if (cached && Array.isArray(cached.list)) { rbHost = cached.host || ''; mergeDirectory(cached.list); }
    if (cached && Date.now() - cached.t < 6 * 3600 * 1000) return;
    if (!navigator.onLine) {
      if (!cached) el.dirStatus.textContent = 'You’re offline, so only the built-in stations are showing.';
      return;
    }
    var hosts = shuffled(RB_HOSTS.slice(0, 3)).concat(RB_HOSTS.slice(3));
    // Find a directory server that answers, using PNG as the first lookup.
    (function tryHost(i) {
      if (i >= hosts.length) {
        if (!cached) el.dirStatus.textContent = 'Couldn’t reach the Radio Browser directory, so only the built-in stations are showing.';
        return;
      }
      var host = hosts[i];
      fetchCountry(host, DIR_COUNTRIES[0]).then(function (first) {
        rbHost = host;
        var all = first.slice();
        var rest = DIR_COUNTRIES.slice(1);
        var next = 0;
        // Look up the other countries, four at a time.
        function worker() {
          if (next >= rest.length) return Promise.resolve();
          var cc = rest[next++];
          return fetchCountry(host, cc).then(function (l) { all = all.concat(l); }, function () {}).then(worker);
        }
        return Promise.all([worker(), worker(), worker(), worker()]).then(function () {
          store.set('dir2', { t: Date.now(), host: host, list: all });
          mergeDirectory(all);
        });
      }).catch(function () { tryHost(i + 1); });
    })(0);
  }

  try { localStorage.removeItem('stratus:dir'); } catch (e) {}
  var counted = {};
  function countListen(st) {
    // Radio Browser asks apps to report a listen so popular stations rise in the directory.
    if (!st || st.source !== 'directory' || counted[st.id] || !rbHost) return;
    counted[st.id] = 1;
    try { fetch(rbHost + '/json/url/' + encodeURIComponent(st.uuid), { mode: 'cors' }).catch(function () {}); } catch (e) {}
  }

  /* ---------- Install ---------- */

  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    el.install.hidden = false;
  });
  window.addEventListener('appinstalled', function () { el.install.hidden = true; deferredPrompt = null; });
  el.installBtn.addEventListener('click', function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    Promise.resolve(deferredPrompt.userChoice).catch(function () {}).then(function () {
      deferredPrompt = null; el.install.hidden = true;
    });
  });
  (function () {
    var ua = navigator.userAgent || '';
    var ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var standalone = navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    if (ios && !standalone) el.installIos.hidden = false;
  })();

  /* ---------- Events ---------- */

  el.list.addEventListener('click', function (e) {
    var row = e.target.closest('.st');
    if (!row) return;
    var st = byId(row.getAttribute('data-id'));
    if (!st) return;
    var favBtn = e.target.closest('.fav');
    if (favBtn) { toggleFav(st, favBtn); return; }
    if (e.target.closest('.st-main')) playStation(st);
  });

  el.chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    filter = b.getAttribute('data-cat');
    store.set('filter', filter);
    renderChips();
    renderList();
  });

  el.countries.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    country = b.getAttribute('data-country');
    store.set('country', country);
    renderCountries();
    renderList();
  });

  el.q.addEventListener('input', function () {
    query = el.q.value.trim().toLowerCase();
    renderList();
  });

  el.playBtn.addEventListener('click', togglePlay);
  el.sleepBtn.addEventListener('click', openSheet);
  el.sleepGrid.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    setSleep(Number(b.getAttribute('data-min')));
    closeSheet();
  });
  el.sleepOff.addEventListener('click', function () { setSleep(0); closeSheet(); });
  el.sheet.addEventListener('click', function (e) { if (e.target === el.sheet) closeSheet(); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== ' ' && e.key !== 'k') return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'BUTTON' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (el.sheet.open) return;
    e.preventDefault();
    togglePlay();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) checkSleep();
  });

  /* ---------- Start ---------- */

  function restoreLast() {
    var last = byId(store.get('last', ''));
    if (last) { current = last; state = 'idle'; renderPlayer(); syncRows(); updateMediaMeta(); }
  }

  renderCountries();
  renderChips();
  renderList();
  restoreLast();
  (function () {
    var on = el.countries.querySelector('[aria-pressed="true"]');
    if (on && on.getAttribute('data-country') !== 'all') el.countries.scrollLeft = Math.max(0, on.offsetLeft - 24);
  })();
  renderPlayer();
  renderSleep();
  loadDirectory();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  // Exposed for testing in the browser console.
  window.stratus = { stations: allStations, play: function (id) { playStation(byId(id)); }, state: function () { return state; } };
})();
