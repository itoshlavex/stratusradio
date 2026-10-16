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
    match: ['yumi'], homepage: 'https://www.yumifm.net/'
  },
  {
    id: 'legend-fm', country: 'PG',
    name: 'Legend FM', freq: '101.1 FM',
    city: 'Port Moresby', lang: 'English', desc: 'Greatest hits and news',
    cats: ['music'], tile: 'royal',
    stream: ['https://stream.rcs.revma.com/4ke2h79kmbpwv'],
    match: ['legend'], homepage: 'https://www.legendfm.net/'
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
    stream: ['https://natradio.nbc.com.pg/listen/nbcnationalradio/radio.mp3'],
    match: ['nbc national', 'karai', 'national broadcasting'], homepage: 'https://www.nbc.com.pg/listen'
  },
  {
    id: 'wantok-light', country: 'PG',
    name: 'Wantok Radio Light', freq: '93.9 FM',
    city: 'Port Moresby', also: '105.9 FM network, shortwave 7325 kHz',
    lang: 'Tok Pisin, English', desc: 'Christian radio',
    cats: ['christian'], tile: 'ice',
    stream: ['https://ca7ssl.rcast.net/stream/61643//;type=mp3', 'https://ca7ssl.rcast.net/stream/61643'],
    match: ['wantok'], homepage: 'http://www.wantokradio.org/'
  },
  {
    id: 'radio-maria-png', country: 'PG',
    name: 'Radio Maria PNG', freq: '103.5 FM',
    city: 'Port Moresby', also: 'Wewak, Lae, Mt Hagen, Mendi, Kimbe',
    lang: 'English', desc: 'Catholic radio',
    cats: ['christian'], tile: 'royal',
    stream: ['https://dreamsiteradiocp2.com/proxy/rmpapua2?mp=/stream'],
    match: ['radio maria'], homepage: 'http://www.radiomariapng.org/'
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

  /* ---------- Vanuatu ---------- */
  {
    id: 'radio-vanuatu', country: 'VU',
    name: 'Radio Vanuatu', freq: '', short: 'VBTC',
    city: 'Port Vila', lang: 'Bislama, English, French',
    desc: 'The national broadcaster: news, talk and music',
    cats: ['news'], tile: 'navy',
    stream: ['https://radio.vbtc.vu/radiovanuatu'],
    match: ['radio vanuatu', 'vbtc'], homepage: 'https://vbtc.vu/radio'
  },
  {
    id: 'paradise-fm', country: 'VU',
    name: 'Paradise FM', freq: '98 FM',
    city: 'Port Vila', lang: 'Bislama, English', desc: 'Music and variety from VBTC',
    cats: ['music'], tile: 'sky',
    stream: ['https://radio.vbtc.vu/paradisefm'],
    match: ['paradise'], homepage: 'https://vbtc.vu/radio'
  },
  {
    id: 'femme-pawa-fm', country: 'VU',
    name: 'Femme Pawa FM', freq: '', short: 'FP',
    city: 'Port Vila', lang: 'Bislama, English', desc: 'Variety from VBTC',
    cats: ['music'], tile: 'royal',
    stream: ['https://radio.vbtc.vu/femmefm'],
    match: ['femme'], homepage: 'https://vbtc.vu/radio'
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
    match: ['rythme bleu', 'rrb'], homepage: 'http://www.rrb.nc/'
  },

  /* ---------- French Polynesia ---------- */
  {
    id: 'polynesie-1ere', country: 'PF',
    name: 'Polynésie la 1ère', freq: '', short: 'P1',
    city: 'Papeete', lang: 'French, Tahitian', desc: 'Public radio: news, talk and music',
    cats: ['news'], tile: 'navy',
    stream: ['https://polynesie.ice.infomaniak.ch/polynesie-128.mp3'],
    match: ['polynesie', 'polynésie'], homepage: 'https://la1ere.francetvinfo.fr/polynesie/'
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
    match: ['wallis'], homepage: 'https://la1ere.francetvinfo.fr/wallisfutuna/'
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
      'https://18243.live.streamtheworld.com/531PI_SC',
      'https://playerservices.streamtheworld.com/api/livestream-redirect/531PIAAC_SC'
    ],
    match: ['531'], homepage: 'https://pmn.co.nz/stations/531-pi'
  },
  {
    id: 'niu-fm', country: 'NZ',
    name: 'Niu FM', freq: '', short: 'NIU',
    city: 'Auckland', lang: 'English', desc: 'Pacific hip-hop and R&B',
    cats: ['music'], tile: 'sky',
    stream: [
      'https://14613.live.streamtheworld.com/NIUFM_SC',
      'https://playerservices.streamtheworld.com/api/livestream-redirect/NIUFM.mp3'
    ],
    match: ['niu fm', 'niufm'], homepage: 'https://pmn.co.nz/radio-stations/niu-fm'
  },

  /* ---------- Pacific-wide services ---------- */
  {
    id: 'rnz-pacific', country: 'XP',
    name: 'RNZ Pacific', freq: '', short: 'RNZ',
    city: 'Wellington, NZ', lang: 'English', desc: 'Pacific news from Radio New Zealand',
    cats: ['news'], tile: 'navy',
    stream: [
      'https://radionz-ice.streamguys.com/international.mp3',
      'http://radionz-ice.streamguys.com/international.mp3'
    ],
    match: ['rnz', 'radio new zealand'], homepage: 'https://www.rnz.co.nz/international'
  },
  {
    id: 'abc-radio-australia', country: 'XP',
    name: 'ABC Radio Australia', freq: '', short: 'ABC',
    city: 'Australia', also: '101.9 FM in Port Moresby',
    lang: 'English', desc: 'Pacific news and programmes from Australia',
    cats: ['news'], tile: 'bright',
    stream: [
      'https://live-radio01.mediahubaustralia.com/RAEW/mp3/',
      'http://live-radio01.mediahubaustralia.com/RAEW/mp3/'
    ],
    match: ['radio australia'], homepage: 'https://www.abc.net.au/pacific'
  }
];
