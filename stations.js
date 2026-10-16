/*
  Stratus Radio: built-in station list.

  Each station:
    id       unique key (also used for favourites, so don't rename it)
    name     display name
    country  two-letter country code: PG, FJ, SB, VU, NC, WS, TO, PF, WF, GU, NZ ...
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
    name: 'NBC National Radio', freq: '', short: 'NBC',
    city: 'Nationwide', lang: 'English, Tok Pisin',
    desc: 'The national broadcaster: news, current affairs and talkback',
    cats: ['news'], tile: 'deep',
    resolve: { type: 'azuracast', api: 'https://natradio.nbc.com.pg/api/nowplaying/nbcnationalradio' },
    // Usual AzuraCast address, used if the live lookup above fails.
    stream: ['https://natradio.nbc.com.pg/listen/nbcnationalradio/nbc.mp3'],
    match: ['nbc national', 'karai', 'national broadcasting'], homepage: 'https://www.nbc.com.pg/listen'
  },
  {
    id: 'hope-radio-png', country: 'PG',
    name: 'Adventist Hope Radio', freq: '107.5 FM',
    city: 'Lae',
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
    stream: ['https://dreamsiteradiocp2.com/proxy/rmpapua2?mp=/stream'],
    match: ['radio maria'], homepage: 'https://www.radiomariapng.org/'
  },
  {
    id: 'laif-fm', country: 'PG',
    name: 'Laif FM', freq: '98.3 FM',
    city: 'Wewak', also: '102.7 FM', lang: 'English',
    desc: 'Christian music and programmes from UCB PNG',
    cats: ['christian', 'music'], tile: 'sky',
    stream: ['https://streams3.vision.org.au/png.aac'],
    match: ['laif', 'ucb png'], homepage: 'https://www.laiffm.org/'
  },
  {
    id: 'life-worship', country: 'PG',
    name: 'Life Worship', freq: '', short: 'LW',
    city: 'Online', lang: 'English', desc: 'Non-stop worship music from UCB Asia Pacific',
    cats: ['christian', 'music'], tile: 'navy',
    stream: ['https://streams2.vision.org.au/worshipap.aac'],
    match: ['life worship', 'ucb asia'], homepage: 'https://www.laiffm.org/live/'
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
    name: 'Radio Fiji One', freq: '', short: 'RF1',
    city: 'Suva', lang: 'iTaukei (Fijian)', desc: 'FBC’s iTaukei station: news, talk and music',
    cats: ['news', 'music'], tile: 'navy',
    stream: ['https://icecast1.sere.plus/RFOne'],
    match: ['radio fiji one', 'rf1'], homepage: 'https://www.fbcnews.com.fj/'
  },
  {
    id: 'bula-fm', country: 'FJ',
    name: 'Bula FM', freq: '', short: 'BULA',
    city: 'Suva', lang: 'iTaukei (Fijian)', desc: 'Fijian music and entertainment from FBC',
    cats: ['music'], tile: 'sky',
    stream: ['https://icecast1.sere.plus/Bula'],
    match: ['bula'], homepage: 'https://www.fbcnews.com.fj/'
  },
  {
    id: 'radio-fiji-two', country: 'FJ',
    name: 'Radio Fiji Two', freq: '', short: 'RF2',
    city: 'Suva', lang: 'Fiji Hindi', desc: 'FBC’s Hindi station: news, talk and music',
    cats: ['news', 'music'], tile: 'deep',
    stream: ['https://icecast1.sere.plus/RFTwo'],
    match: ['radio fiji two', 'rf2'], homepage: 'https://www.fbcnews.com.fj/'
  },
  {
    id: 'mirchi-fm', country: 'FJ',
    name: 'Mirchi FM', freq: '', short: 'MIR',
    city: 'Suva', lang: 'Fiji Hindi', desc: 'Bollywood and Fiji Hindi hits from FBC',
    cats: ['music'], tile: 'bright',
    stream: ['https://icecast1.sere.plus/MirchiFiji'],
    match: ['mirchi'], homepage: 'https://www.fbcnews.com.fj/'
  },
  {
    id: 'gold-fm-fiji', country: 'FJ',
    name: 'Gold FM', freq: '', short: 'GOLD',
    city: 'Suva', lang: 'English', desc: 'FBC News, talk and classic hits',
    cats: ['news', 'music'], tile: 'royal',
    stream: ['https://icecast1.sere.plus/Gold'],
    match: ['gold fm'], homepage: 'https://www.fbcnews.com.fj/'
  },
  {
    id: '2day-fm-fiji', country: 'FJ',
    name: '2Day FM', freq: '', short: '2DAY',
    city: 'Suva', lang: 'English', desc: 'Today’s hits from FBC',
    cats: ['music'], tile: 'ice',
    stream: ['https://icecast1.sere.plus/2Day'],
    match: ['2day'], homepage: 'https://www.fbcnews.com.fj/'
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

  /* ---------- Wallis and Futuna ---------- */
  {
    id: 'wallis-futuna-1ere', country: 'WF',
    name: 'Wallis et Futuna la 1ère', freq: '', short: 'WF1',
    city: 'Mata-Utu', lang: 'French, Wallisian, Futunan', desc: 'Public radio: news and music',
    cats: ['news'], tile: 'ice',
    stream: ['https://wallisetfutuna.ice.infomaniak.ch/wallisetfutuna-128.mp3'],
    match: ['wallis'], homepage: 'https://la1ere.franceinfo.fr/wallisfutuna/'
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
