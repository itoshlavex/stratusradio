/*
  Stratus Radio: built-in station list.

  Each station:
    id       unique key (also used for favourites, so don't rename it)
    name     display name
    freq     dial position shown on the tile, e.g. "93.1 FM" (leave empty for online-only)
    short    letters shown on the tile when there is no frequency
    city     main town
    also     other places it can be heard (optional)
    lang     language(s)
    desc     one-line description
    cats     any of: music, news, christian, pacific
    tile     tile colour: navy, royal, bright, sky, ice, deep
    stream   list of stream URLs, tried in order until one plays
    resolve  optional: look the stream up live (AzuraCast "now playing" API)
    match    words used to spot the same station in the online directory
    homepage station website

  To add a station: copy a block, give it a new id and paste its direct
  stream URL (the address that plays audio, not the station's web page).
*/
window.STRATUS_STATIONS = [
  {
    id: 'yumi-fm',
    name: 'Yumi FM',
    freq: '93.1 FM',
    city: 'Port Moresby',
    also: 'Lae, Mt Hagen, Goroka, Madang',
    lang: 'Tok Pisin',
    desc: 'PNG music, news and talkback',
    cats: ['music', 'news'],
    tile: 'sky',
    stream: ['https://stream.rcs.revma.com/n5vb288kmbpwv'],
    match: ['yumi'],
    homepage: 'https://www.yumifm.net/'
  },
  {
    id: 'legend-fm',
    name: 'Legend FM',
    freq: '101.1 FM',
    city: 'Port Moresby',
    lang: 'English',
    desc: 'Greatest hits and news',
    cats: ['music'],
    tile: 'royal',
    stream: ['https://stream.rcs.revma.com/4ke2h79kmbpwv'],
    match: ['legend'],
    homepage: 'https://www.legendfm.net/'
  },
  {
    id: 'nau-fm',
    name: 'Nau FM',
    freq: '96.5 FM',
    city: 'Port Moresby',
    lang: 'English',
    desc: 'Today’s hits',
    cats: ['music'],
    tile: 'bright',
    stream: ['https://stream.rcs.revma.com/ae7zr39kmbpwv'],
    match: ['nau fm', 'naufm'],
    homepage: 'https://naufm.net/'
  },
  {
    id: 'fm100',
    name: 'FM100',
    freq: '100.4 FM',
    city: 'Port Moresby',
    lang: 'English',
    desc: 'News, talkback, hits and memories. On air since 1982',
    cats: ['news', 'music'],
    tile: 'navy',
    stream: ['https://online.fm100.com.pg/;'],
    match: ['fm100', 'fm 100', 'kalang'],
    homepage: 'https://fm100.com.pg/'
  },
  {
    id: 'nbc-national',
    name: 'NBC National Radio',
    freq: '',
    short: 'NBC',
    city: 'Nationwide',
    lang: 'English, Tok Pisin',
    desc: 'The national broadcaster: news, current affairs and talkback',
    cats: ['news'],
    tile: 'deep',
    resolve: { type: 'azuracast', api: 'https://natradio.nbc.com.pg/api/nowplaying/nbcnationalradio' },
    // Usual AzuraCast address, used if the live lookup above fails.
    stream: ['https://natradio.nbc.com.pg/listen/nbcnationalradio/radio.mp3'],
    match: ['nbc national', 'karai', 'national broadcasting'],
    homepage: 'https://www.nbc.com.pg/listen'
  },
  {
    id: 'wantok-light',
    name: 'Wantok Radio Light',
    freq: '93.9 FM',
    city: 'Port Moresby',
    also: '105.9 FM network, shortwave 7325 kHz',
    lang: 'Tok Pisin, English',
    desc: 'Christian radio',
    cats: ['christian'],
    tile: 'ice',
    stream: [
      'https://ca7ssl.rcast.net/stream/61643//;type=mp3',
      'https://ca7ssl.rcast.net/stream/61643'
    ],
    match: ['wantok'],
    homepage: 'http://www.wantokradio.org/'
  },
  {
    id: 'radio-maria-png',
    name: 'Radio Maria PNG',
    freq: '103.5 FM',
    city: 'Port Moresby',
    also: 'Wewak, Lae, Mt Hagen, Mendi, Kimbe',
    lang: 'English',
    desc: 'Catholic radio',
    cats: ['christian'],
    tile: 'royal',
    stream: ['https://dreamsiteradiocp2.com/proxy/rmpapua2?mp=/stream'],
    match: ['radio maria'],
    homepage: 'http://www.radiomariapng.org/'
  },
  {
    id: 'laif-fm',
    name: 'Laif FM',
    freq: '98.3 FM',
    city: 'Wewak',
    also: '102.7 FM',
    lang: 'English',
    desc: 'Christian music and programmes from UCB PNG',
    cats: ['christian', 'music'],
    tile: 'sky',
    stream: ['https://streams3.vision.org.au/png.aac'],
    match: ['laif', 'ucb png'],
    homepage: 'https://www.laiffm.org/'
  },
  {
    id: 'life-worship',
    name: 'Life Worship',
    freq: '',
    short: 'LW',
    city: 'Online',
    lang: 'English',
    desc: 'Non-stop worship music from UCB Asia Pacific',
    cats: ['christian', 'music'],
    tile: 'navy',
    stream: ['https://streams2.vision.org.au/worshipap.aac'],
    match: ['life worship', 'ucb asia'],
    homepage: 'https://www.laiffm.org/live/'
  },
  {
    id: 'abc-radio-australia',
    name: 'ABC Radio Australia',
    freq: '101.9 FM',
    city: 'Port Moresby relay',
    lang: 'English',
    desc: 'Pacific news and programmes from Australia',
    cats: ['pacific', 'news'],
    tile: 'bright',
    stream: [
      'https://live-radio01.mediahubaustralia.com/RAEW/mp3/',
      'http://live-radio01.mediahubaustralia.com/RAEW/mp3/'
    ],
    match: ['radio australia'],
    homepage: 'https://www.abc.net.au/pacific'
  },
  {
    id: 'rnz-pacific',
    name: 'RNZ Pacific',
    freq: '',
    short: 'RNZ',
    city: 'Wellington, NZ',
    lang: 'English',
    desc: 'Pacific news from Radio New Zealand',
    cats: ['pacific', 'news'],
    tile: 'deep',
    stream: [
      'https://radionz-ice.streamguys.com/international.mp3',
      'http://radionz-ice.streamguys.com/international.mp3'
    ],
    match: ['rnz', 'radio new zealand'],
    homepage: 'https://www.rnz.co.nz/international'
  }
];
