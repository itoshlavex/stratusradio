/*
  Stratus Radio: built-in station list.

  Each station:
    id       unique key (also used for favourites, so don't rename it)
    name     display name
    country  two-letter country code: PG, FJ, SB, VU, NC, WS, TO, PF, WF, GU, NZ, AU ...
             (XP = Pacific-wide services). Names are listed in app.js under COUNTRIES.
    freq     dial position shown on the tile, e.g. "93.1 FM" (leave empty for online-only)
    short    letters shown on the tile when there is no frequency
    city     main town
    also     other places it can be heard (optional)
    lang     language(s)
    desc     one-line description
    cats     any of: music, news, christian
    tile     tile colour: navy, royal, bright, sky, ice, deep
    stream   list of stream URLs, tried in order until one plays
    resolve  optional: look the stream up live (AzuraCast "now playing" API)
    np       optional: where the station publishes the song on air (ABC stations)
    match    words used to spot the same station in the online directory
    homepage station website

  To add a station: copy a block, give it a new id and paste its direct
  stream URL (the address that plays audio, not the station's web page).
*/
window.STRATUS_STATIONS = [

  /* ---------- Papua New Guinea ---------- */
  {
    id: 'yumi-fm', country: 'PG',
    name: 'Yumi FM', freq: '93.1 FM',
    city: 'Port Moresby', also: 'Lae, Mt Hagen, Goroka, Madang',
    lang: 'Tok Pisin', desc: 'PNG music, news and talkback',
    cats: ['music', 'news'], tile: 'sky',
    stream: ['https://stream.rcs.revma.com/n5vb288kmbpwv'],
    match: ['yumi'], homepage: 'https://yumifm.net/'
  },
  {
    id: 'legend-fm', country: 'PG',
    name: 'Legend FM', freq: '101.1 FM',
    city: 'Port Moresby', lang: 'English', desc: 'Greatest hits and news',
    cats: ['music'], tile: 'royal',
    stream: ['https://stream.rcs.revma.com/4ke2h79kmbpwv'],
    match: ['legend'], homepage: 'https://legendfm.net/'
  },
  {
    id: 'nau-fm', country: 'PG',
    name: 'Nau FM', freq: '96.5 FM',
    city: 'Port Moresby', lang: 'English', desc: 'Today’s hits',
    cats: ['music'], tile: 'bright',
    stream: ['https://stream.rcs.revma.com/ae7zr39kmbpwv'],
    match: ['nau fm', 'naufm'], homepage: 'https://naufm.net/'
  },
  {
    id: 'fm100', country: 'PG',
    name: 'FM100', freq: '100.4 FM',
    city: 'Port Moresby', lang: 'English', desc: 'News, talkback, hits and memories. On air since 1982',
    cats: ['news', 'music'], tile: 'navy',
    stream: ['https://online.fm100.com.pg/;'],
    match: ['fm100', 'fm 100', 'kalang'], homepage: 'https://fm100.com.pg/'
  },
  {
    id: 'nbc-national', country: 'PG',
    name: 'NBC National Radio', freq: '90.7 FM',
    city: 'Port Moresby', also: '585 AM, NBC stations nationwide', lang: 'English, Tok Pisin',
    desc: 'The national broadcaster: news, current affairs and talkback',
    cats: ['news'], tile: 'deep',
    resolve: { type: 'azuracast', api: 'https://natradio.nbc.com.pg/api/nowplaying/nbcnationalradio' },
    // Usual AzuraCast address, used if the live lookup above fails.
    stream: ['https://natradio.nbc.com.pg/listen/nbcnationalradio/nbc.mp3'],
    match: ['nbc national', 'karai', 'national broadcasting'], homepage: 'https://www.nbc.com.pg/listen'
  },
  {
    id: 'tribe-fm', country: 'PG',
    name: 'Tribe FM', freq: '92.3 FM',
    city: 'Port Moresby',
    desc: 'NBC’s youth station: new music, trends and talk',
    cats: ['music'], tile: 'bright',
    resolve: { type: 'azuracast', api: 'https://natradio.nbc.com.pg/api/nowplaying/tribe_fm' },
    stream: ['https://natradio.nbc.com.pg/listen/tribe_fm/radio.mp3'],
    match: ['tribe fm', 'tribe 92'], homepage: 'https://www.nbc.com.pg/'
  },
  {
    id: 'hope-radio-png', country: 'PG',
    name: 'Adventist Hope Radio', freq: '107.5 FM',
    city: 'Lae', also: 'Kokopo and Kimbe',
    desc: 'Seventh-day Adventist radio: gospel music, talk and Bible programmes',
    cats: ['christian'], tile: 'bright',
    stream: ['https://servidor30-3.brlogic.com:7020/live'],
    match: ['hope radio', 'hope fm'], homepage: 'https://www.facebook.com/adventisthoperadiopng'
  },
  {
    id: 'wantok-light', country: 'PG',
    name: 'Wantok Radio Light', freq: '93.9 FM',
    city: 'Port Moresby', also: '105.9 FM network, shortwave 7325 kHz',
    lang: 'Tok Pisin, English', desc: 'Christian radio: “Your Inspiration Station”',
    cats: ['christian'], tile: 'ice',
    resolve: { type: 'azuracast', api: 'https://radio.kinect.com.pg/api/nowplaying/wrl' },
    stream: ['https://radio.kinect.com.pg/listen/wrl/radio.mp3'],
    match: ['wantok'], homepage: 'https://www.wantokradio.org/'
  },
  {
    id: 'radio-maria-png', country: 'PG',
    name: 'Radio Maria PNG', freq: '103.5 FM',
    city: 'Port Moresby', also: 'Wewak, Lae, Mt Hagen, Mendi, Kimbe',
    lang: 'English', desc: 'Catholic radio',
    cats: ['christian'], tile: 'royal',
    stream: ['https://dreamsiteradiocp2.com/proxy/rmpapua2?mp=/stream', 'https://dreamsiteradiocp6.com/proxy/rmpapua?mp=/stream'],
    match: ['radio maria'], homepage: 'https://www.radiomariapng.org/'
  },
  {
    id: 'laif-fm', country: 'PG',
    name: 'Laif FM', freq: '98.3 FM',
    city: 'Wewak', also: '102.7 FM', lang: 'English',
    desc: 'Christian music and programmes from UCB PNG',
    cats: ['christian', 'music'], tile: 'sky',
    stream: ['https://streams3.vision.org.au/png.aac', 'https://streams2.vision.org.au/png.aac'],
    match: ['laif', 'ucb png'], homepage: 'https://www.laiffm.org/'
  },
  {
    id: 'life-worship', country: 'PG',
    name: 'Life Worship', freq: '', short: 'LW',
    city: 'Online', lang: 'English', desc: 'Non-stop worship music from UCB Asia Pacific',
    cats: ['christian', 'music'], tile: 'navy',
    stream: ['https://streams2.vision.org.au/worshipap.aac', 'https://streams3.vision.org.au/worshipap.aac'],
    match: ['life worship', 'ucb asia'], homepage: 'https://www.laiffm.org/live/'
  },
  {
    id: 'life-fm-bougainville', country: 'PG',
    name: 'Life FM Bougainville', freq: '', short: 'LFB',
    city: 'Buka',
    lang: 'English', desc: 'Christian music and teaching from UCB, online ahead of an FM launch',
    cats: ['christian', 'music'], tile: 'deep',
    stream: ['https://streams3.vision.org.au/bougainville.aac', 'https://streams2.vision.org.au/bougainville.aac'],
    match: ['life fm bougainville'], homepage: 'https://www.ucbasiapacific.org/projects/bougainville/'
  },

  /* ---------- Fiji ---------- */
  {
    id: 'fm96-fiji', country: 'FJ',
    name: 'FM96', freq: '96.2 FM',
    city: 'Suva', lang: 'English', desc: 'Fiji’s contemporary hits',
    cats: ['music'], tile: 'bright',
    stream: ['https://stream.rcs.revma.com/q8txpfyyay3vv'],
    match: ['fm96', 'fm 96'], homepage: 'https://www.fm96.com.fj/'
  },
  {
    id: 'legend-fm-fiji', country: 'FJ',
    name: 'Legend FM', freq: '', short: 'LFM',
    city: 'Suva', lang: 'English', desc: 'Classic hits',
    cats: ['music'], tile: 'deep',
    stream: ['https://stream.rcs.revma.com/7wnnz47a303vv'],
    match: ['legend'], homepage: 'https://www.fijivillage.com/stream/legendfm/'
  },
  {
    id: 'viti-fm', country: 'FJ',
    name: 'Viti FM', freq: '', short: 'VITI',
    city: 'Suva', lang: 'iTaukei (Fijian)', desc: 'Fijian music and talk',
    cats: ['music'], tile: 'sky',
    stream: ['https://stream.rcs.revma.com/3c11kc9a303vv'],
    match: ['viti'], homepage: 'https://www.fijivillage.com/stream/vitifm/'
  },
  {
    id: 'radio-navtarang', country: 'FJ',
    name: 'Radio Navtarang', freq: '', short: 'NAV',
    city: 'Suva', lang: 'Fiji Hindi', desc: 'Bollywood music and talk',
    cats: ['music'], tile: 'royal',
    stream: ['https://stream.rcs.revma.com/5f56gd8a303vv'],
    match: ['navtarang'], homepage: 'https://www.fijivillage.com/stream/navtarang/'
  },
  {
    id: 'radio-sargam', country: 'FJ',
    name: 'Radio Sargam', freq: '', short: 'SAR',
    city: 'Suva', lang: 'Fiji Hindi', desc: 'Bollywood hits',
    cats: ['music'], tile: 'ice',
    stream: ['https://stream.rcs.revma.com/8a38ru8a303vv'],
    match: ['sargam'], homepage: 'https://www.fijivillage.com/stream/radiosargam/'
  },
  {
    id: 'radio-fiji-one', country: 'FJ',
    name: 'Radio Fiji One', freq: '93 FM',
    city: 'Suva', also: '558 AM and other FM frequencies', lang: 'iTaukei (Fijian)', desc: 'FBC’s iTaukei station: news, talk and music',
    cats: ['news', 'music'], tile: 'navy',
    stream: ['https://icecast1.sere.plus/RFOne'],
    match: ['radio fiji one', 'rf1'], homepage: 'https://www.fbc.com.fj/'
  },
  {
    id: 'bula-fm', country: 'FJ',
    name: 'Bula FM', freq: '102.6 FM',
    city: 'Suva', lang: 'iTaukei (Fijian)', desc: 'Fijian music and entertainment from FBC',
    cats: ['music'], tile: 'sky',
    stream: ['https://icecast1.sere.plus/Bula'],
    match: ['bula'], homepage: 'https://www.fbc.com.fj/'
  },
  {
    id: 'radio-fiji-two', country: 'FJ',
    name: 'Radio Fiji Two', freq: '105 FM',
    city: 'Suva', also: 'other FM frequencies around Fiji', lang: 'Fiji Hindi', desc: 'FBC’s Hindi station: news, talk and music',
    cats: ['news', 'music'], tile: 'deep',
    stream: ['https://icecast1.sere.plus/RFTwo'],
    match: ['radio fiji two', 'rf2'], homepage: 'https://www.fbc.com.fj/'
  },
  {
    id: 'mirchi-fm', country: 'FJ',
    name: 'Mirchi FM', freq: '97.8 FM',
    city: 'Suva', lang: 'Fiji Hindi', desc: 'Bollywood and Fiji Hindi hits from FBC',
    cats: ['music'], tile: 'bright',
    stream: ['https://icecast1.sere.plus/MirchiFiji'],
    match: ['mirchi'], homepage: 'https://www.fbc.com.fj/'
  },
  {
    id: 'gold-fm-fiji', country: 'FJ',
    name: 'Gold FM', freq: '100.2 FM',
    city: 'Suva', lang: 'English', desc: 'Classic hits from the 70s, 80s and 90s, plus FBC News',
    cats: ['news', 'music'], tile: 'royal',
    stream: ['https://icecast1.sere.plus/Gold'],
    match: ['gold fm'], homepage: 'https://www.fbc.com.fj/'
  },
  {
    id: '2day-fm-fiji', country: 'FJ',
    name: '2Day FM', freq: '95.4 FM',
    city: 'Suva', lang: 'English', desc: 'Today’s hits from FBC',
    cats: ['music'], tile: 'ice',
    stream: ['https://icecast1.sere.plus/2Day'],
    match: ['2day'], homepage: 'https://www.fbc.com.fj/'
  },
  {
    id: 'life-fm-fiji', country: 'FJ',
    name: 'Life FM', freq: '', short: 'LIFE',
    city: '', desc: 'Christian music and programmes',
    cats: ['christian', 'music'], tile: 'navy',
    stream: ['https://stream.rcast.net/65809'],
    match: ['life fm'], homepage: ''
  },

  /* ---------- Vanuatu ---------- */
  {
    id: 'radio-vanuatu', country: 'VU',
    name: 'Radio Vanuatu', freq: '', short: 'VBTC',
    city: 'Port Vila', lang: 'Bislama, English, French',
    desc: 'The national broadcaster: news, talk and music',
    cats: ['news'], tile: 'navy',
    stream: ['https://radio.vbtc.vu/radiovanuatu'],
    match: ['radio vanuatu', 'vbtc'], homepage: 'https://vbtc.vu/radio-2/'
  },
  {
    id: 'paradise-fm', country: 'VU',
    name: 'Paradise FM', freq: '98 FM',
    city: 'Port Vila', lang: 'Bislama, English', desc: 'Music and variety from VBTC',
    cats: ['music'], tile: 'sky',
    stream: ['https://radio.vbtc.vu/paradisefm'],
    match: ['paradise'], homepage: 'https://vbtc.vu/radio-2/'
  },
  {
    id: 'femme-pawa-fm', country: 'VU',
    name: 'Femme Pawa FM', freq: '', short: 'FP',
    city: 'Port Vila', lang: 'Bislama, English', desc: 'Variety from VBTC',
    cats: ['music'], tile: 'royal',
    stream: ['https://radio.vbtc.vu/femmefm'],
    match: ['femme'], homepage: 'https://vbtc.vu/radio-2/'
  },
  {
    id: 'buzz-fm', country: 'VU',
    name: 'Buzz FM', freq: '96.3 FM',
    city: 'Port Vila', lang: 'English, Bislama', desc: 'News, pop and rock',
    cats: ['music', 'news'], tile: 'bright',
    stream: ['https://streamer.dailypost.vu/live'],
    match: ['buzz'], homepage: 'https://www.buzzfm.vu/'
  },

  /* ---------- New Caledonia ---------- */
  {
    id: 'rrb-nc', country: 'NC',
    name: 'Radio Rythme Bleu', freq: '', short: 'RRB',
    city: 'Nouméa', lang: 'French', desc: 'News and talk',
    cats: ['news'], tile: 'deep',
    stream: ['https://webradio.lagoon.nc/rrb'],
    match: ['rythme bleu', 'rrb'], homepage: 'https://www.rrb.nc/'
  },
  {
    id: 'nc-1ere', country: 'NC',
    name: 'Nouvelle-Calédonie la 1ère', freq: '', short: 'NC1',
    city: 'Nouméa',
    lang: 'French', desc: 'Public radio: news, local music and talk',
    cats: ['news', 'music'], tile: 'navy',
    stream: ['https://nouvelle-caledonie.ice.infomaniak.ch/nouvelle-caledonie-128.mp3'],
    match: ['nouvelle-caledonie', 'caledonie la 1ere'], homepage: 'https://la1ere.franceinfo.fr/nouvellecaledonie/'
  },
  {
    id: 'nrj-nc', country: 'NC',
    name: 'NRJ Nouvelle-Calédonie', freq: '93.5 FM',
    city: 'Nouméa',
    lang: 'French', desc: 'Hit music',
    cats: ['music'], tile: 'bright',
    stream: ['https://testradio01.ice.infomaniak.ch/testradio01-192.mp3'],
    match: ['nrj'], homepage: 'https://nrj.nc/'
  },
  {
    id: 'radio-djiido', country: 'NC',
    name: 'Radio Djiido', freq: '', short: 'DJI',
    city: 'Nouméa',
    lang: 'French', desc: 'Kanak community radio: news, talk and Pacific music',
    cats: ['news', 'music'], tile: 'sky',
    stream: ['https://djiido.nc/proxy/stream/96k', 'https://djiido.nc/proxy/stream/aac'],
    match: ['djiido'], homepage: 'https://djiido.nc/'
  },
  {
    id: 'nia-pacifique', country: 'NC',
    name: 'NIA Pacifique', freq: '', short: 'NIA',
    city: 'Nouméa',
    lang: 'French', desc: 'Electronic music from Nouméa',
    cats: ['music'], tile: 'royal',
    stream: ['https://radio.nia.nc/radio/8000/pacific-hq-stream.aac'],
    match: ['nia pacifique', 'nia radio'], homepage: 'https://nia.nc/'
  },

  /* ---------- Samoa ---------- */
  {
    id: 'radio-2ap', country: 'WS',
    name: 'Radio 2AP', freq: '540 AM',
    city: 'Apia',
    lang: 'Samoan, English', desc: 'Samoa’s national radio since 1947: news, warnings and culture',
    cats: ['news'], tile: 'navy',
    stream: ['https://stream.zeno.fm/xe3v4z7gc2zuv'],
    match: ['2ap'], homepage: 'https://mcit.gov.ws/divisions/broadcasting-division/'
  },
  {
    id: 'magik-fm', country: 'WS',
    name: 'Magik 98.1', freq: '98.1 FM',
    city: 'Apia',
    lang: 'English', desc: 'Hit music from Radio Polynesia',
    cats: ['music'], tile: 'bright',
    stream: ['https://ice5.securenetsystems.net/MAGIKFM'],
    match: ['magik'], homepage: 'https://streamdb8web.securenetsystems.net/cirrusencore/MAGIKFM'
  },
  {
    id: 'star-961', country: 'WS',
    name: 'Star 96.1', freq: '96.1 FM',
    city: 'Apia',
    lang: 'English', desc: 'Music variety from Radio Polynesia',
    cats: ['music'], tile: 'sky',
    stream: ['https://ice26.securenetsystems.net/STAR961'],
    match: ['star 96'], homepage: 'https://streamdb7web.securenetsystems.net/cirrusencore/STAR961'
  },
  {
    id: 'talofa-fm', country: 'WS',
    name: 'Talofa FM', freq: '', short: 'TAL',
    city: 'Apia',
    lang: 'Samoan', desc: 'Samoan-language music and talk from Radio Polynesia',
    cats: ['music'], tile: 'royal',
    stream: ['https://ice26.securenetsystems.net/TALOFAFM'],
    match: ['talofa'], homepage: 'https://streamdb8web.securenetsystems.net/cirrusencore/TALOFAFM'
  },
  {
    id: 'aiga-fesilafai', country: 'WS',
    name: 'Aiga Fesilafai FM', freq: '', short: 'AF',
    city: '',
    lang: 'Samoan, English', desc: 'Catholic radio',
    cats: ['christian'], tile: 'ice',
    stream: ['https://stream.zeno.fm/lhh9kxksbzbtv'],
    match: ['aiga fesilafai'], homepage: 'https://zeno.fm/radio/aigafesilafai-fm/'
  },
  {
    id: 'laufou-ole-talalelei', country: 'WS',
    name: 'Laufou ole Talalelei', freq: '', short: 'LT',
    city: '',
    lang: 'Samoan', desc: 'Youth for Christ radio',
    cats: ['christian'], tile: 'deep',
    stream: ['https://stream.zeno.fm/wmbu9tm76otvv'],
    match: ['laufou'], homepage: 'https://zeno.fm/radio/laufouoletalalelei/'
  },

  /* ---------- American Samoa ---------- */
  {
    id: '93khj', country: 'AS',
    name: '93KHJ', freq: '93.1 FM',
    city: 'Pago Pago',
    lang: 'English', desc: 'Hit music and KHJ News',
    cats: ['music', 'news'], tile: 'royal',
    stream: ['https://ice25.securenetsystems.net/KKHJ'],
    match: ['khj'], homepage: 'https://www.southseasbroadcasting.com/93khj/'
  },
  {
    id: 'v103', country: 'AS',
    name: 'V103', freq: '103.1 FM',
    city: 'Fagaitua',
    lang: 'Samoan, English', desc: 'Samoan and Polynesian favourites',
    cats: ['music'], tile: 'sky',
    stream: ['https://ice26.securenetsystems.net/WVUV'],
    match: ['v103', 'wvuv'], homepage: 'https://www.southseasbroadcasting.com/v103/'
  },
  {
    id: 'the-beat-as', country: 'AS',
    name: 'The Beat', freq: '104.7 FM',
    city: 'Leone',
    lang: 'English', desc: 'Hit music',
    cats: ['music'], tile: 'bright',
    stream: ['https://ice25.securenetsystems.net/KKBT'],
    match: ['the beat', 'kkbt'], homepage: 'https://www.southseasbroadcasting.com/1047beat/'
  },
  {
    id: 'oldies-937', country: 'AS',
    name: 'Oldies 93.7', freq: '93.7 FM',
    city: 'Pago Pago',
    lang: 'English', desc: 'Good times and great oldies',
    cats: ['music'], tile: 'ice',
    stream: ['https://ice26.securenetsystems.net/KKHJHD2'],
    match: ['oldies'], homepage: 'https://www.southseasbroadcasting.com/kkhjhd2/'
  },

  /* ---------- Tonga ---------- */
  {
    id: 'broadcom-fm', country: 'TO',
    name: 'Broadcom FM', freq: '87.5 FM',
    city: 'Nukuʻalofa',
    lang: 'Tongan, English', desc: 'Community radio: news, talk, faith and Pacific music',
    cats: ['news', 'music'], tile: 'navy',
    stream: ['https://stream.zeno.fm/ame0ehzmb'],
    match: ['broadcom'], homepage: 'https://broadcomfm.com/'
  },

  /* ---------- French Polynesia ---------- */
  {
    id: 'polynesie-1ere', country: 'PF',
    name: 'Polynésie la 1ère', freq: '', short: 'P1',
    city: 'Papeete', lang: 'French, Tahitian', desc: 'Public radio: news, talk and music',
    cats: ['news'], tile: 'navy',
    stream: ['https://polynesie.ice.infomaniak.ch/polynesie-128.mp3'],
    match: ['polynesie', 'polynésie'], homepage: 'https://la1ere.franceinfo.fr/polynesie/'
  },
  {
    id: 'radio-1-tahiti', country: 'PF',
    name: 'Radio 1', freq: '', short: 'R1',
    city: 'Papeete', lang: 'French', desc: 'News and pop hits',
    cats: ['news', 'music'], tile: 'bright',
    stream: ['https://live.radio1.pf:8443/radio1'],
    match: ['radio 1', 'radio1'], homepage: 'https://www.radio1.pf/'
  },
  {
    id: 'tiare-fm', country: 'PF',
    name: 'Tiare FM', freq: '', short: 'TFM',
    city: 'Papeete', lang: 'French, Tahitian', desc: 'Pop hits and news',
    cats: ['music'], tile: 'sky',
    stream: ['https://live.tiarefm.pf:8443/tiarefm'],
    match: ['tiare'], homepage: 'https://www.tiarefm.pf/'
  },
  {
    id: 'hiti-fm', country: 'PF',
    name: 'Hiti FM', freq: '', short: 'HITI',
    city: 'Tahiti',
    lang: 'French', desc: 'Pop and hit music',
    cats: ['music'], tile: 'royal',
    stream: ['https://stream.radiojar.com/u0yz7p0mb', 'https://n01.radiojar.com/u0yz7p0mb.mp3'],
    match: ['hiti'], homepage: 'https://hiti-fm.com/'
  },

  /* ---------- Wallis and Futuna ---------- */
  {
    id: 'wallis-futuna-1ere', country: 'WF',
    name: 'Wallis et Futuna la 1ère', freq: '', short: 'WF1',
    city: 'Mata-Utu', lang: 'French, Wallisian, Futunan', desc: 'Public radio: news and music',
    cats: ['news'], tile: 'ice',
    stream: ['https://wallisetfutuna.ice.infomaniak.ch/wallisetfutuna-128.mp3'],
    match: ['wallis'], homepage: 'https://la1ere.franceinfo.fr/wallisfutuna/'
  },

  /* ---------- Kiribati ---------- */
  {
    id: 'radio-kiribati', country: 'KI',
    name: 'Radio Kiribati', freq: '1440 AM',
    city: 'South Tarawa',
    desc: 'National radio: news and music',
    cats: ['news', 'music'], tile: 'navy',
    stream: ['https://streamer5.rightclickitservices.com:19790/stream'],
    match: ['radio kiribati'], homepage: ''
  },

  /* ---------- Micronesia ---------- */
  {
    id: 'bible-baptist-chuuk', country: 'FM',
    name: 'Bible Baptist Radio', freq: '88.5 FM',
    city: 'Weno, Chuuk',
    desc: 'Baptist Christian radio',
    cats: ['christian'], tile: 'ice',
    stream: ['https://streaming.radio.co/s25a6afba9/listen'],
    match: ['bible baptist'], homepage: 'https://zeno.fm/radio/bible-baptist-radio-chuuk/'
  },

  /* ---------- Guam ---------- */
  {
    id: 'power-98-guam', country: 'GU',
    name: 'Power 98', freq: '97.5 FM',
    city: 'Hagåtña', lang: 'English', desc: 'Hip-hop and R&B hits',
    cats: ['music'], tile: 'royal',
    stream: ['https://ice3.securenetsystems.net/KZGZ'],
    match: ['power 98', 'kzgz'], homepage: 'https://power98.com'
  },
  {
    id: 'boss-1043', country: 'GU',
    name: 'Boss 104.3', freq: '104.3 FM',
    city: 'Tumon',
    lang: 'English', desc: 'Adult contemporary hits',
    cats: ['music'], tile: 'navy',
    stream: ['https://ice10.securenetsystems.net/KIJI'],
    match: ['boss', 'kiji'], homepage: 'https://boss104.gu/'
  },
  {
    id: 'star-101', country: 'GU',
    name: 'Star 101', freq: '101.1 FM',
    city: 'Tumon',
    lang: 'English', desc: 'Rhythmic and pop hits',
    cats: ['music'], tile: 'bright',
    stream: ['https://ice9.securenetsystems.net/KNUT'],
    match: ['star 101', 'knut'], homepage: 'https://star101.gu/'
  },
  {
    id: 'the-point-guam', country: 'GU',
    name: 'The Point', freq: '93.3 FM',
    city: 'Hagåtña', also: '1350 AM',
    lang: 'English', desc: 'News and talk',
    cats: ['news'], tile: 'deep',
    stream: ['https://ice10.securenetsystems.net/KUSG'],
    match: ['the point', 'kusg'], homepage: 'https://thepoint.gu/'
  },
  {
    id: 'wave-1051', country: 'GU',
    name: 'Wave 105.1', freq: '105.1 FM',
    city: 'Dededo',
    lang: 'English', desc: 'News and talk on weekdays, island music at weekends',
    cats: ['news', 'music'], tile: 'sky',
    stream: ['https://ice3.securenetsystems.net/KGUMFM'],
    match: ['wave 105', 'kgum'], homepage: 'https://thewave105.com/'
  },
  {
    id: 'harvest-family-radio', country: 'GU',
    name: 'Harvest Family Radio', freq: '88.1 FM',
    city: '',
    lang: 'English', desc: 'Christian family radio',
    cats: ['christian'], tile: 'ice',
    stream: ['https://streaming.live365.com/a11295'],
    match: ['harvest', 'khmg'], homepage: 'https://khmg.org/'
  },
  {
    id: 'joy-fm-guam', country: 'GU',
    name: 'Joy FM', freq: '91.9 FM',
    city: 'Hågat', also: 'relays in Saipan, Majuro, Kwajalein, Pohnpei, Kosrae and Yap',
    lang: 'English', desc: 'Seventh-day Adventist Christian radio for Guam and Micronesia',
    cats: ['christian'], tile: 'royal',
    stream: ['https://ice5.securenetsystems.net/JOYFM'],
    match: ['joy fm', 'ksda'], homepage: 'https://joyfmradio.net/'
  },

  /* ---------- Pacific stations in New Zealand ---------- */
  {
    id: 'radio-531pi', country: 'NZ',
    name: 'Radio 531pi', freq: '102.2 FM',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English, Samoan, Tongan and more', desc: 'Pacific talk, news and music',
    cats: ['news', 'music'], tile: 'deep',
    stream: [
      'https://playerservices.streamtheworld.com/api/livestream-redirect/531PI_SC',
      'https://playerservices.streamtheworld.com/api/livestream-redirect/531PIAAC_SC'
    ],
    match: ['531'], homepage: 'https://pmn.co.nz/radio-stations/531-pi'
  },
  {
    id: 'niu-fm', country: 'NZ',
    name: 'Niu FM', freq: '', short: 'NIU',
    city: 'Auckland', lang: 'English', desc: 'Pacific hip-hop and R&B',
    cats: ['music'], tile: 'sky',
    stream: [
      'https://playerservices.streamtheworld.com/api/livestream-redirect/NIUFM_SC',
      'https://playerservices.streamtheworld.com/api/livestream-redirect/NIUFMAAC_SC'
    ],
    match: ['niu fm', 'niufm'], homepage: 'https://pmn.co.nz/radio-stations/niu-fm'
  },
  {
    id: 'planet-fm', country: 'NZ',
    name: 'Planet FM', freq: '104.6 FM',
    city: 'Auckland',
    lang: 'Many languages', desc: 'Community radio with programmes in many Pacific and world languages',
    cats: ['news', 'music'], tile: 'ice',
    stream: ['https://live.accessmedia.nz/PlanetFM.stream/playlist.m3u8', 'https://live.accessmedia.nz/PlanetFM.stream_aac/playlist.m3u8'],
    homepage: 'https://www.planetaudio.org.nz/'
  },

  /* ---------- New Zealand ---------- */
  {
    id: 'rnz-national', country: 'NZ',
    name: 'RNZ National', freq: '', short: 'RNZ',
    city: 'Wellington', also: 'AM and FM across NZ',
    lang: 'English', desc: 'Public radio: news, current affairs and documentaries',
    cats: ['news'], tile: 'navy',
    stream: ['https://radionz.streamguys1.com/national/national/playlist.m3u8'],
    homepage: 'https://www.rnz.co.nz/national'
  },
  {
    id: 'rnz-concert', country: 'NZ',
    name: 'RNZ Concert', freq: '', short: 'RNZC',
    city: 'Wellington', also: 'FM across NZ',
    lang: 'English', desc: 'Classical music, jazz and the arts',
    cats: ['music'], tile: 'deep',
    stream: ['https://radionz.streamguys1.com/concert/concert/playlist.m3u8'],
    homepage: 'https://www.rnz.co.nz/concert'
  },
  {
    id: 'newstalk-zb', country: 'NZ',
    name: 'Newstalk ZB', freq: '', short: 'ZB',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'News, talkback and sport',
    cats: ['news'], tile: 'royal',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_01AAC_SC'],
    homepage: 'https://www.newstalkzb.co.nz/'
  },
  {
    id: 'zm', country: 'NZ',
    name: 'ZM', freq: '', short: 'ZM',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Today’s hit music',
    cats: ['music'], tile: 'bright',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_03AAC_SC'],
    homepage: 'https://www.zmonline.com/'
  },
  {
    id: 'the-hits', country: 'NZ',
    name: 'The Hits', freq: '', short: 'HITS',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Hit music from the 2000s to now',
    cats: ['music'], tile: 'sky',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_02AAC_SC'],
    homepage: 'https://www.thehits.co.nz/'
  },
  {
    id: 'coast', country: 'NZ',
    name: 'Coast', freq: '', short: 'CST',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Easy hits from the 70s, 80s and 90s',
    cats: ['music'], tile: 'ice',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_07AAC_SC'],
    homepage: 'https://www.thecoast.net.nz/'
  },
  {
    id: 'radio-hauraki', country: 'NZ',
    name: 'Radio Hauraki', freq: '', short: 'HRK',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Rock, comedy and sport banter',
    cats: ['music'], tile: 'navy',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_04AAC_SC'],
    homepage: 'https://www.hauraki.co.nz/'
  },
  {
    id: 'flava', country: 'NZ',
    name: 'Flava', freq: '', short: 'FLV',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Hip-hop and R&B',
    cats: ['music'], tile: 'royal',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_08AAC_SC'],
    homepage: 'https://www.flava.co.nz/'
  },
  {
    id: 'iheartcountry', country: 'NZ',
    name: 'iHeartCountry', freq: '', short: 'CTRY',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Country music',
    cats: ['music'], tile: 'deep',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NZME_09AAC_SC'],
    homepage: 'https://www.iheartcountry.co.nz/'
  },
  {
    id: 'the-rock', country: 'NZ',
    name: 'The Rock', freq: '', short: 'ROCK',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Rock music and comedy',
    cats: ['music'], tile: 'navy',
    stream: ['https://mediaworks.streamguys1.com/rock_net_icy'],
    homepage: 'https://www.rova.nz/radio/the-rock'
  },
  {
    id: 'the-edge', country: 'NZ',
    name: 'The Edge', freq: '', short: 'EDGE',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Today’s hits',
    cats: ['music'], tile: 'bright',
    stream: ['https://mediaworks.streamguys1.com/edge_net_icy'],
    homepage: 'https://www.rova.nz/radio/the-edge'
  },
  {
    id: 'more-fm', country: 'NZ',
    name: 'More FM', freq: '', short: 'MORE',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Feel-good hits',
    cats: ['music'], tile: 'sky',
    stream: ['https://mediaworks.streamguys1.com/more_net_icy'],
    homepage: 'https://www.rova.nz/radio/more-fm'
  },
  {
    id: 'the-breeze', country: 'NZ',
    name: 'The Breeze', freq: '', short: 'BRZ',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Easy listening favourites',
    cats: ['music'], tile: 'ice',
    stream: ['https://mediaworks.streamguys1.com/breeze_net_icy'],
    homepage: 'https://www.rova.nz/radio/the-breeze'
  },
  {
    id: 'mai-fm', country: 'NZ',
    name: 'Mai FM', freq: '', short: 'MAI',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Hip-hop and R&B',
    cats: ['music'], tile: 'royal',
    stream: ['https://mediaworks.streamguys1.com/mai_net_icy'],
    homepage: 'https://www.rova.nz/radio/mai-fm'
  },
  {
    id: 'george-fm', country: 'NZ',
    name: 'George FM', freq: '', short: 'GEO',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Dance and electronic music',
    cats: ['music'], tile: 'deep',
    stream: ['https://mediaworks.streamguys1.com/george_net_icy'],
    homepage: 'https://www.rova.nz/radio/george-fm'
  },
  {
    id: 'the-sound', country: 'NZ',
    name: 'The Sound', freq: '', short: 'SND',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Classic rock',
    cats: ['music'], tile: 'navy',
    stream: ['https://mediaworks.streamguys1.com/sound_net_icy'],
    homepage: 'https://www.rova.nz/radio/the-sound'
  },
  {
    id: 'magic', country: 'NZ',
    name: 'Magic', freq: '', short: 'MGC',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Classic hits',
    cats: ['music'], tile: 'bright',
    stream: ['https://mediaworks.streamguys1.com/magic_net_icy'],
    homepage: 'https://www.rova.nz/radio/magic'
  },
  {
    id: 'life-fm-nz', country: 'NZ',
    name: 'Life FM', freq: '', short: 'LIFE',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Christian music for a younger crowd',
    cats: ['christian', 'music'], tile: 'sky',
    stream: ['https://rhema-radio.streamguys1.com/rhema-lifefm.mp3'],
    homepage: 'https://www.lifefm.co.nz/'
  },
  {
    id: 'rhema', country: 'NZ',
    name: 'Rhema', freq: '', short: 'RHM',
    city: 'Auckland', also: 'FM network across NZ',
    lang: 'English', desc: 'Christian music, talk and teaching',
    cats: ['christian'], tile: 'ice',
    stream: ['https://rhema-radio.streamguys1.com/rhema.mp3'],
    homepage: 'https://www.rhema.co.nz/'
  },
  {
    id: '95bfm', country: 'NZ',
    name: '95bFM', freq: '95.0 FM',
    city: 'Auckland',
    lang: 'English', desc: 'Independent student radio: new music and talk',
    cats: ['music'], tile: 'deep',
    stream: ['https://streams.95bfm.com/stream95', 'https://streams.95bfm.com/stream128'],
    homepage: 'https://95bfm.com/'
  },
  {
    id: 'tahu-fm', country: 'NZ',
    name: 'Tahu FM', freq: '', short: 'TAHU',
    city: 'Christchurch',
    lang: 'Māori, English', desc: 'Ngāi Tahu radio: music and kōrero',
    cats: ['music'], tile: 'royal',
    stream: ['https://icast1.streamcom.net/TahuFM'],
    homepage: 'https://tahufm.online/'
  },

  /* ---------- Pacific and First Nations stations in Australia ---------- */
  {
    id: 'radio-4mw', country: 'AU',
    name: 'Radio 4MW', freq: '1260 AM',
    city: 'Thursday Island', also: 'Torres Strait, Cape York and PNG’s Western Province',
    lang: 'English, Torres Strait Creole, Kala Lagaw Ya, Meriam Mir',
    desc: 'Torres Strait Islander radio: island music, news and language programmes',
    cats: ['music', 'news'], tile: 'sky',
    stream: ['https://firstnationsmedia.stream/8024/stream'],
    match: ['4mw', 'tsima'], homepage: 'https://www.tsima4mw.org.au/'
  },
  {
    id: 'sbs-radio-1', country: 'AU',
    name: 'SBS Radio 1', freq: '', short: 'SBS',
    city: 'Sydney', also: 'AM and FM across Australia',
    lang: 'Many languages, including Samoan', desc: 'News and programmes in Australia’s many languages, including SBS Samoan',
    cats: ['news'], tile: 'navy',
    stream: ['https://sbs-ice.streamguys1.com/sbs1-sbs-web'],
    homepage: 'https://www.sbs.com.au/audio'
  },
  {
    id: '4eb', country: 'AU',
    name: '4EB Global Radio', freq: '98.1 FM',
    city: 'Brisbane',
    lang: 'Many languages, including Samoan, Tongan and Fijian', desc: 'Community radio in over 50 languages, with Pacific community programmes',
    cats: ['news', 'music'], tile: 'ice',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/4EBAAC.aac', 'https://playerservices.streamtheworld.com/api/livestream-redirect/4EB.mp3'],
    homepage: 'https://www.4eb.org.au/'
  },
  {
    id: 'koori-radio', country: 'AU',
    name: 'Koori Radio', freq: '93.7 FM',
    city: 'Sydney', lang: 'English', desc: 'First Nations music, news and culture',
    cats: ['music', 'news'], tile: 'deep',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/2LNDAAC.aac', 'https://playerservices.streamtheworld.com/api/livestream-redirect/2LND.mp3'],
    homepage: 'https://www.kooriradio.com/'
  },
  {
    id: 'triple-a', country: 'AU',
    name: 'Triple A', freq: '98.9 FM',
    city: 'Brisbane', lang: 'English', desc: 'First Nations radio playing country music',
    cats: ['music'], tile: 'royal',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/989FMAAC.aac', 'https://playerservices.streamtheworld.com/api/livestream-redirect/989FM.mp3'],
    homepage: 'https://triplea.org.au/'
  },

  /* ---------- Australia ---------- */
  // np: where ABC stations publish the song on air (music.abcradio.net.au).
  {
    id: 'triple-j', country: 'AU',
    name: 'triple j', freq: '', short: 'JJJ',
    city: 'Sydney', also: 'FM across Australia',
    lang: 'English', desc: 'ABC youth radio: new music and Australian artists',
    cats: ['music'], tile: 'bright',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/triplejnsw.m3u8?source=web', 'https://abc.streamguys1.com/live/triplejnsw/icecast.audio'],
    np: { type: 'abc', service: 'triplej' },
    homepage: 'https://www.abc.net.au/triplej'
  },
  {
    id: 'double-j', country: 'AU',
    name: 'Double J', freq: '', short: 'JJ',
    city: 'Sydney', also: 'Digital radio across Australia',
    lang: 'English', desc: 'ABC music radio: alternative and classic, old and new',
    cats: ['music'], tile: 'royal',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/doublejnsw.m3u8?source=web', 'https://abc.streamguys1.com/live/doublejnsw/icecast.audio'],
    np: { type: 'abc', service: 'doublej' },
    homepage: 'https://www.abc.net.au/doublej'
  },
  {
    id: 'abc-classic', country: 'AU',
    name: 'ABC Classic', freq: '', short: 'CLS',
    city: 'Sydney', also: 'FM across Australia',
    lang: 'English', desc: 'Classical music',
    cats: ['music'], tile: 'deep',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/classicfmnsw.m3u8?source=web', 'https://abc.streamguys1.com/live/classicfmnsw/icecast.audio'],
    np: { type: 'abc', service: 'classic' },
    homepage: 'https://www.abc.net.au/listen/classic'
  },
  {
    id: 'abc-jazz', country: 'AU',
    name: 'ABC Jazz', freq: '', short: 'JAZZ',
    city: 'Sydney', also: 'Digital radio across Australia',
    lang: 'English', desc: 'Jazz around the clock',
    cats: ['music'], tile: 'navy',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/abcjazz.m3u8?source=web', 'https://abc.streamguys1.com/live/abcjazz/icecast.audio'],
    np: { type: 'abc', service: 'jazz' },
    homepage: 'https://www.abc.net.au/listen/jazz'
  },
  {
    id: 'abc-country', country: 'AU',
    name: 'ABC Country', freq: '', short: 'CTRY',
    city: 'Sydney', also: 'Digital radio across Australia',
    lang: 'English', desc: 'Country music, with plenty from Australia',
    cats: ['music'], tile: 'ice',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/abccountry.m3u8?source=web', 'https://abc.streamguys1.com/live/abccountry/icecast.audio'],
    np: { type: 'abc', service: 'country' },
    homepage: 'https://www.abc.net.au/listen/country'
  },
  {
    id: 'abc-newsradio', country: 'AU',
    name: 'ABC NewsRadio', freq: '', short: 'NEWS',
    city: 'Sydney', also: 'AM and FM across Australia',
    lang: 'English', desc: 'Rolling news, sport and federal parliament',
    cats: ['news'], tile: 'navy',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/newsradio.m3u8?source=web', 'https://abc.streamguys1.com/live/newsradio/icecast.audio'],
    homepage: 'https://www.abc.net.au/listen/news'
  },
  {
    id: 'abc-rn', country: 'AU',
    name: 'ABC Radio National', freq: '', short: 'RN',
    city: 'Sydney', also: 'AM and FM across Australia',
    lang: 'English', desc: 'Ideas, science, the arts and current affairs',
    cats: ['news'], tile: 'deep',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/rnnsw.m3u8?source=web', 'https://abc.streamguys1.com/live/rnnsw/icecast.audio'],
    homepage: 'https://www.abc.net.au/listen/radionational'
  },
  {
    id: 'abc-sydney', country: 'AU',
    name: 'ABC Radio Sydney', freq: '702 AM',
    city: 'Sydney', lang: 'English', desc: 'Local news, talk and sport',
    cats: ['news'], tile: 'sky',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/localsydney.m3u8?source=web', 'https://abc.streamguys1.com/live/localsydney/icecast.audio'],
    homepage: 'https://www.abc.net.au/sydney'
  },
  {
    id: 'abc-melbourne', country: 'AU',
    name: 'ABC Radio Melbourne', freq: '774 AM',
    city: 'Melbourne', lang: 'English', desc: 'Local news, talk and sport',
    cats: ['news'], tile: 'royal',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/localmelbourne.m3u8?source=web', 'https://abc.streamguys1.com/live/localmelbourne/icecast.audio'],
    homepage: 'https://www.abc.net.au/melbourne'
  },
  {
    id: 'abc-brisbane', country: 'AU',
    name: 'ABC Radio Brisbane', freq: '612 AM',
    city: 'Brisbane', lang: 'English', desc: 'Local news, talk and sport',
    cats: ['news'], tile: 'ice',
    stream: ['https://streaming.abc-cdn.net.au/audio/hls/localbrisbane.m3u8?source=web', 'https://abc.streamguys1.com/live/localbrisbane/icecast.audio'],
    homepage: 'https://www.abc.net.au/brisbane'
  },
  {
    id: 'kiis-1065', country: 'AU',
    name: 'KIIS 106.5', freq: '106.5 FM',
    city: 'Sydney', lang: 'English', desc: 'Today’s hit music',
    cats: ['music'], tile: 'bright',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/ARN_KIIS1065AAC.aac', 'https://playerservices.streamtheworld.com/api/livestream-redirect/ARN_KIIS1065.mp3'],
    homepage: 'https://www.iheart.com/live/kiis-1065-6185/'
  },
  {
    id: 'nova-969', country: 'AU',
    name: 'Nova 96.9', freq: '96.9 FM',
    city: 'Sydney', lang: 'English', desc: 'Hit music and entertainment',
    cats: ['music'], tile: 'royal',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/NOVA_969_AAC48.aac'],
    homepage: 'https://novafm.com.au/station/nova969'
  },
  {
    id: '2day-fm', country: 'AU',
    name: '2Day FM', freq: '104.1 FM',
    city: 'Sydney', lang: 'English', desc: 'Hits and entertainment',
    cats: ['music'], tile: 'sky',
    stream: ['https://legacy.scahw.com.au/2day_128', 'https://legacy.scahw.com.au/2day_32'],
    homepage: 'https://hit.listnr.com/sydney/'
  },
  {
    id: 'triple-m-sydney', country: 'AU',
    name: 'Triple M Sydney', freq: '104.9 FM',
    city: 'Sydney', lang: 'English', desc: 'Rock music, footy and comedy',
    cats: ['music'], tile: 'navy',
    stream: ['https://legacy.scahw.com.au/2mmm_128', 'https://legacy.scahw.com.au/2mmm_32'],
    homepage: 'https://triplem.listnr.com/sydney/'
  },
  {
    id: 'smooth-953', country: 'AU',
    name: 'smoothfm 95.3', freq: '95.3 FM',
    city: 'Sydney', lang: 'English', desc: 'Relaxing favourites',
    cats: ['music'], tile: 'ice',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/SMOOTH953_AAC48.aac'],
    homepage: 'https://smooth.com.au/station/smoothfm953'
  },
  {
    id: 'gold-1043', country: 'AU',
    name: 'Gold 104.3', freq: '104.3 FM',
    city: 'Melbourne', lang: 'English', desc: 'Classic hits from the 70s, 80s and 90s',
    cats: ['music'], tile: 'deep',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/ARN_GOLD1043AAC.aac', 'https://playerservices.streamtheworld.com/api/livestream-redirect/ARN_GOLD1043.mp3'],
    homepage: 'https://www.gold1043.com.au/'
  },
  {
    id: 'fox-fm', country: 'AU',
    name: 'Fox FM', freq: '101.9 FM',
    city: 'Melbourne', lang: 'English', desc: 'Today’s hits',
    cats: ['music'], tile: 'bright',
    stream: ['https://legacy.scahw.com.au/3fox_128', 'https://legacy.scahw.com.au/3fox_32'],
    homepage: 'https://hit.listnr.com/melbourne/'
  },
  {
    id: 'b105', country: 'AU',
    name: 'B105', freq: '105.3 FM',
    city: 'Brisbane', lang: 'English', desc: 'Hit music',
    cats: ['music'], tile: 'sky',
    stream: ['https://legacy.scahw.com.au/4bbb_128', 'https://legacy.scahw.com.au/4bbb_32'],
    homepage: 'https://hit.listnr.com/brisbane/'
  },
  {
    id: 'hope-1032', country: 'AU',
    name: 'Hope 103.2', freq: '103.2 FM',
    city: 'Sydney', lang: 'English', desc: 'Christian radio: feel-good music, faith and family',
    cats: ['christian', 'music'], tile: 'sky',
    stream: ['https://playerservices.streamtheworld.com/api/livestream-redirect/2CBAAAC.aac', 'https://playerservices.streamtheworld.com/api/livestream-redirect/2CBA.mp3'],
    homepage: 'https://hope1032.com.au/'
  },
  {
    id: 'rise-965', country: 'AU',
    name: 'Rise 96.5', freq: '96.5 FM',
    city: 'Brisbane', lang: 'English', desc: 'Christian family radio: music, news and talk',
    cats: ['christian', 'music'], tile: 'royal',
    stream: ['https://stream1.cnmns.net/96five'],
    match: ['96five'], homepage: 'https://rise965.com/'
  },
  {
    id: 'vision-radio', country: 'AU',
    name: 'Vision Christian Radio', freq: '', short: 'VIS',
    city: 'Brisbane', also: 'FM network across Australia',
    lang: 'English', desc: 'Christian music, teaching and prayer',
    cats: ['christian'], tile: 'ice',
    stream: ['https://streams2.vision.org.au/vision128.mp3', 'https://streams3.vision.org.au/vision128.mp3'],
    homepage: 'https://vision.org.au/'
  },

  /* ---------- Pacific-wide services ---------- */
  {
    id: 'rnz-pacific', country: 'XP',
    name: 'RNZ Pacific', freq: '', short: 'RNZP',
    city: 'Wellington, NZ', lang: 'English', desc: 'Pacific news from Radio New Zealand',
    cats: ['news'], tile: 'navy',
    stream: ['https://radionz.streamguys1.com/pacific/pacific/playlist.m3u8'],
    match: ['rnz', 'radio new zealand'], homepage: 'https://www.rnz.co.nz/international'
  },
  {
    id: 'abc-radio-australia', country: 'XP',
    name: 'ABC Radio Australia', freq: '', short: 'ABC',
    city: 'Australia', also: '101.9 FM in Port Moresby',
    lang: 'English', desc: 'Pacific news and programmes from Australia',
    cats: ['news'], tile: 'bright',
    stream: [
      'https://streaming.abc-cdn.net.au/audio/hls/ramulti.m3u8?source=web',
      'https://live-radio01.mediahubaustralia.com/RAMW/aac/?source=web'
    ],
    match: ['radio australia'], homepage: 'https://www.abc.net.au/pacific'
  }
];
