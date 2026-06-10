/**
 * channels.js — Channel data sourced from M3U8 playlist.
 * Categories: Entertainment, General, News, Sports, Music, Kids,
 *             Movies, Business, Religious, Family, Legislative
 * Icons from tvg-logo attributes. Best quality stream picked per channel.
 */
const CHANNELS_DATA = {
  categories: [
    {
      name: 'Sports',
      icon: '⚽',
      channels: [
        {
          id: 't-sports',
          name: 'T Sports',
          shortName: 'TSPT',
          logo: 'https://i.imgur.com/2JzlorD.png',
          stream: 'https://tvsen7.aynaott.com/tsportsfhd/index.m3u8',
          quality: 'HD'
        },
      ]
    },
    {
      name: 'News',
      icon: '📰',
      channels: [
        {
          id: 'somoy-tv',
          name: 'Somoy News TV',
          shortName: 'SOMOY',
          logo: 'https://i.imgur.com/i54AQic.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'channel-24',
          name: 'Channel 24',
          shortName: 'CH24',
          logo: 'https://i.imgur.com/4JLkaF7.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'independent-tv',
          name: 'Independent TV',
          shortName: 'ITV',
          logo: 'https://i.imgur.com/POXFhGN.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/1704.m3u8',
          quality: 'FHD'
        },
        {
          id: 'ekattor-tv',
          name: 'Ekattor TV',
          shortName: '71TV',
          logo: 'https://i.imgur.com/zoLwwUK.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/1705.m3u8',
          quality: 'FHD'
        },
        {
          id: 'atn-news',
          name: 'ATN News',
          shortName: 'ATNN',
          logo: 'https://i.imgur.com/4qZQKjo.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/1706.m3u8',
          quality: 'FHD'
        },
        {
          id: 'jamuna-tv',
          name: 'Jamuna TV',
          shortName: 'JTV',
          logo: 'https://www.jamuna.tv/wp-content/themes/jtv-news/img/logo.png',
          stream: 'https://bozztv.com/rongo/rongo-JamunaTelevision/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'news-24',
          name: 'News 24',
          shortName: 'N24',
          logo: 'https://i.imgur.com/fkTHh75.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/1708.m3u8',
          quality: 'FHD'
        },
        {
          id: 'desh-tv',
          name: 'Desh TV',
          shortName: 'DESH',
          logo: 'https://i.imgur.com/ItrZok1.png',
          stream: 'https://bozztv.com/rongo/rongo-DeshTV/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'ekushey-tv',
          name: 'Ekushey TV',
          shortName: 'ETV',
          logo: 'https://i.imgur.com/lRpkGHj.png',
          stream: 'https://tvsen6.aynaott.com/etv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'dbc-news',
          name: 'DBC News',
          shortName: 'DBC',
          logo: 'https://i.imgur.com/Qbt6q4z.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'bijoy-tv',
          name: 'Bijoy TV',
          shortName: 'BIJOY',
          logo: 'https://i.imgur.com/Faetm0C.png',
          stream: 'https://tvsen6.aynaott.com/bijoytv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'ekhon-tv',
          name: 'Ekhon TV',
          shortName: 'EKHON',
          logo: 'https://i.imgur.com/tRrDh6z.png',
          stream: 'https://tplay.live/out/bangladesh/ekhontv.index.m3u8',
          quality: 'FHD'
        },
      ]
    },
    {
      name: 'Entertainment',
      icon: '🎬',
      channels: [
        {
          id: 'ananda-tv',
          name: 'Ananda TV',
          shortName: 'AND',
          logo: 'https://i.imgur.com/jkbo7Qe.png',
          stream: 'https://bozztv.com/rongo/rongo-AnandaTV/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'asian-tv',
          name: 'Asian TV',
          shortName: 'ASIAN',
          logo: 'https://i.imgur.com/k2adSjA.png',
          stream: 'https://tvsen6.aynaott.com/asiantv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'deepto-tv',
          name: 'Deepto TV',
          shortName: 'DPTO',
          logo: 'https://i.imgur.com/F62GUqS.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'maasranga-tv',
          name: 'Maasranga TV',
          shortName: 'MSTV',
          logo: 'https://i.imgur.com/uVZJMed.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8',
          quality: 'FHD'
        },
      ]
    },
    {
      name: 'General',
      icon: '📺',
      channels: [
        {
          id: 'atn-bangla',
          name: 'ATN Bangla',
          shortName: 'ATNB',
          logo: 'https://i.imgur.com/K1HmMRz.png',
          stream: 'https://tvsen5.aynaott.com/atnbangla/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'bangla-tv',
          name: 'Bangla TV',
          shortName: 'BNG',
          logo: 'https://i.imgur.com/DLGjTfI.png',
          stream: 'https://tvsen6.aynaott.com/banglatv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'bangla-vision',
          name: 'Bangla Vision',
          shortName: 'BV',
          logo: 'https://i.imgur.com/nCWgp38.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'boishakhi-tv',
          name: 'Boishakhi TV',
          shortName: 'BOIS',
          logo: 'https://i.imgur.com/gxL05Y4.png',
          stream: 'https://tvsen6.aynaott.com/boishakhitv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'channel-9',
          name: 'Channel 9',
          shortName: 'CH9',
          logo: 'https://i.imgur.com/Xf5YuoE.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1729/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'channel-i',
          name: 'Channel I',
          shortName: 'CHI',
          logo: 'https://i.imgur.com/X0JJlOX.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'gazi-tv',
          name: 'Gazi TV',
          shortName: 'GAZI',
          logo: 'https://i.imgur.com/2Lzhiq6.png',
          stream: 'https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'global-tv',
          name: 'Global TV',
          shortName: 'GLB',
          logo: 'https://i.imgur.com/oe0pq1R.png',
          stream: 'https://tvsen6.aynaott.com/globaltvhd/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'mohona-tv',
          name: 'Mohona TV',
          shortName: 'MOHO',
          logo: 'https://i.imgur.com/E6doEWH.png',
          stream: 'https://bozztv.com/rongo/rongo-MohonaTV/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'my-tv',
          name: 'My TV',
          shortName: 'MYTV',
          logo: 'https://i.imgur.com/475qK5T.png',
          stream: 'https://tvsen6.aynaott.com/mytv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'ntv',
          name: 'NTV',
          shortName: 'NTV',
          logo: 'https://i.imgur.com/l75bDTx.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'rtv',
          name: 'RTV',
          shortName: 'RTV',
          logo: 'https://i.imgur.com/yu8ugqt.png',
          stream: 'https://bozztv.com/rongo/rongo-RTV/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'sa-tv',
          name: 'SA TV',
          shortName: 'SATV',
          logo: 'https://i.imgur.com/tL9kxxB.png',
          stream: 'https://tvsen6.aynaott.com/satv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'vokta-tv',
          name: 'Vokta TV',
          shortName: 'VKTA',
          logo: 'https://i.imgur.com/szAGBCU.png',
          stream: 'https://vokta.raytahost.com/live/voktatv/index.m3u8',
          quality: 'HD'
        },
      ]
    },
    {
      name: 'BTV',
      icon: '🏛️',
      channels: [
        {
          id: 'btv-national',
          name: 'BTV National',
          shortName: 'BTV',
          logo: 'https://i.imgur.com/5OE2FDt.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/1709.m3u8',
          quality: 'FHD'
        },
        {
          id: 'btv-world',
          name: 'BTV World',
          shortName: 'BTVW',
          logo: 'https://i.imgur.com/sSnrg7o.png',
          stream: 'https://tvsen6.aynaott.com/btv_world/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'btv-chattogram',
          name: 'BTV Chattogram',
          shortName: 'BTVC',
          logo: 'https://i.imgur.com/hvpyuek.png',
          stream: 'https://bozztv.com/rongo/rongo-BTVChattagram/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'btv-news',
          name: 'BTV News',
          shortName: 'BTVN',
          logo: 'https://www.btvlive.gov.bd/_next/image?url=https%3A%2F%2Fd38ll44lbmt52p.cloudfront.net%2Fcms%2Fchannel_poster%2F1735648543857_Poster.jpg&w=3840&q=75',
          stream: 'https://tvsen6.aynaott.com/BTVNews/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'sangsad-tv',
          name: 'Sangsad TV',
          shortName: 'SANG',
          logo: 'https://i.imgur.com/jkouxLg.png',
          stream: 'https://bozztv.com/rongo/rongo-SangsadTV/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'star-news',
          name: 'Star News',
          shortName: 'STAR',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Star_News_Bangladesh_Logo.svg/1280px-Star_News_Bangladesh_Logo.svg.png',
          stream: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8',
          quality: 'FHD'
        },
      ]
    },
    {
      name: 'Kids',
      icon: '🧒',
      channels: [
        {
          id: 'duronto-tv',
          name: 'Duronto TV',
          shortName: 'DRNT',
          logo: 'https://i.imgur.com/gXsddRK.png',
          stream: 'https://tvsen6.aynaott.com/durontotv-live/index.m3u8',
          quality: 'HD'
        },
      ]
    },

    {
      name: 'Movies',
      icon: '🎞️',
      channels: [
        {
          id: 'movie-bangla',
          name: 'Movie Bangla',
          shortName: 'MBNGL',
          logo: 'https://www.jagobd.com/wp-content/uploads/2016/02/moviebangla.jpg?x50681',
          stream: 'http://alvetv.com/moviebanglatv/8080/index.m3u8',
          quality: 'SD'
        },
      ]
    },
    {
      name: 'Religious',
      icon: '🕌',
      channels: [
        {
          id: 'madani-channel',
          name: 'Madani Channel Bangla',
          shortName: 'MCB',
          logo: 'https://i.imgur.com/vIJTVia.png',
          stream: 'https://streaming.madanichannel.tv/static/streaming-playlists/hls/d3e49b76-ac06-4689-a641-9200445b647f/master.m3u8',
          quality: 'FHD'
        },
        {
          id: 'al-quran-tv',
          name: 'Al Quran Al Kareem TV',
          shortName: 'QURAN',
          logo: 'https://aloula.faulio.com/storage/mediagallery/da/6c/fullhd_7eaf7e165c4cad5b3a45eff65d2011e18be5d670.png',
          stream: 'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8',
          quality: 'SD'
        },
        {
          id: 'al-sunnah-tv',
          name: 'Al Sunnah Al Nabawiyah TV',
          shortName: 'SUNNAH',
          logo: 'https://aloula.faulio.com/storage/mediagallery/33/92/fullhd_879e557011826f507a045b4e0b4c3b57ba93edae.png',
          stream: 'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8',
          quality: 'SD'
        },
        {
          id: 'peace-tv-bangla',
          name: 'Peace TV Bangla',
          shortName: 'PEACE',
          logo: 'https://i.imgur.com/1ztVXUi.png',
          stream: 'https://dzkyvlfyge.erbvr.com/PeaceTvBangla/index.m3u8',
          quality: 'FHD'
        },
        {
          id: 'peace-tv-english',
          name: 'Peace TV English',
          shortName: 'PTVE',
          logo: 'https://i.imgur.com/rjgCM2B.png',
          stream: 'https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8',
          quality: 'FHD'
        },
      ]
    },
    {
      name: 'Family',
      icon: '👨‍👩‍👧',
      channels: [
        {
          id: 'green-tv',
          name: 'Green TV',
          shortName: 'GRN',
          logo: 'https://www.jagobd.com/wp-content/uploads/2022/12/green-tv.jpg',
          stream: 'https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/playlist.m3u8',
          quality: 'FHD'
        },
      ]
    },
  ]
};
