/**
 * channels.js — IPTV channel data
 * Default streams from: https://github.com/sadabx/iptv
 * Streams ordered highest quality first (YouTube-style).
 */
const CHANNELS_DATA = {
  categories: [
    {
      name: "Sports",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/><path d=\"M2 12h20\"/></svg>",
      channels: [
        {
          id: "t-sports",
          name: "T Sports",
          shortName: "TSPT",
          logo: "assets/logos/2JzlorD.png",
          quality: "HD",
          streams: [
            {
              label: "720p-2",
              url: "https://tvsen7.aynaott.com/tsportsfhd/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8"
            }
          ]
        }
      ]
    },
    {
      name: "News",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2\"/><path d=\"M18 14h-8\"/><path d=\"M15 18h-5\"/><path d=\"M10 6h8v4h-8V6z\"/></svg>",
      channels: [
        {
          id: "atn-news",
          name: "ATN News",
          shortName: "ATNN",
          logo: "assets/logos/atn-news.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p-2",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/1706.m3u8"
            },
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-ATNNews/index.m3u8"
            }
          ]
        },
        {
          id: "channel-1",
          name: "Channel 1",
          shortName: "CH1",
          logo: "assets/logos/channel-1.svg",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8"
            }
          ]
        },
        {
          id: "channel-24",
          name: "Channel 24",
          shortName: "CH24",
          logo: "assets/logos/channel-24.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p-2",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8"
            },
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-Channel24HD/index.m3u8"
            }
          ]
        },
        {
          id: "dbc-news",
          name: "DBC News",
          shortName: "DBC",
          logo: "assets/logos/dbc-news.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/dbcnews/index.m3u8"
            },
            {
              label: "480p",
              url: "http://tvn3.chowdhury-shaheb.com/dbc/index.m3u8"
            }
          ]
        },
        {
          id: "desh-tv",
          name: "Desh TV",
          shortName: "DESH",
          logo: "assets/logos/desh-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-DeshTV/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/deshtv/index.m3u8"
            }
          ]
        },
        {
          id: "ekattor-tv",
          name: "Ekattor TV",
          shortName: "71TV",
          logo: "assets/logos/ekattor-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/1705.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/ekattorbdtv/index.m3u8"
            }
          ]
        },
        {
          id: "ekhon-tv",
          name: "Ekhon TV",
          shortName: "EKHON",
          logo: "assets/logos/ekhon-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://tplay.live/out/bangladesh/ekhontv.index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/ekhontv/index.m3u8"
            }
          ]
        },
        {
          id: "ekushey-tv",
          name: "Ekushey TV",
          shortName: "ETV",
          logo: "assets/logos/ekushey-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/etv/index.m3u8"
            },
            {
              label: "480p",
              url: "https://ekusheyserver.com/etvlivesn.m3u8"
            }
          ]
        },
        {
          id: "independent-tv",
          name: "Independent TV",
          shortName: "ITV",
          logo: "assets/logos/independent-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p-2",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/1704.m3u8"
            },
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-IndependentTV/index.m3u8"
            },
            {
              label: "480p",
              url: "https://tvsen6.aynaott.com/independenttv/index.m3u8"
            }
          ]
        },
        {
          id: "jamuna-tv",
          name: "Jamuna TV",
          shortName: "JTV",
          logo: "assets/logos/jamuna-tv.svg",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-JamunaTelevision/index.m3u8"
            },
            {
              label: "480p",
              url: "https://tvsen6.aynaott.com/jamunatv/index.m3u8"
            }
          ]
        },
        {
          id: "news-24",
          name: "News 24",
          shortName: "N24",
          logo: "assets/logos/news-24.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p-2",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/1708.m3u8"
            },
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-News24HD/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/news24/index.m3u8"
            }
          ]
        },
        {
          id: "somoy-tv",
          name: "Somoy TV",
          shortName: "SOMOY",
          logo: "assets/logos/somoy-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-somoy/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/somoytv/index.m3u8"
            }
          ]
        },
        {
          id: "star-news",
          name: "Star News",
          shortName: "STAR",
          logo: "assets/logos/star-news.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8"
            }
          ]
        }
      ]
    },
    {
      name: "General & Entertainment",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"15\" rx=\"2\" ry=\"2\"/><polyline points=\"17 2 12 7 7 2\"/></svg>",
      channels: [
        {
          id: "ananda-tv",
          name: "Ananda TV",
          shortName: "AND",
          logo: "assets/logos/ananda-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-AnandaTV/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/anandatv/index.m3u8"
            },
            {
              label: "480p",
              url: "http://103.99.249.139/anandatv/index.m3u8"
            }
          ]
        },
        {
          id: "asian-tv",
          name: "Asian TV",
          shortName: "ASIAN",
          logo: "assets/logos/asian-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/asiantv/index.m3u8"
            }
          ]
        },
        {
          id: "atn-bangla",
          name: "ATN Bangla",
          shortName: "ATNB",
          logo: "assets/logos/atn-bangla.svg",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/atnbangla/index.m3u8"
            }
          ]
        },
        {
          id: "bangla-tv",
          name: "Bangla TV",
          shortName: "BNG",
          logo: "assets/logos/bangla-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/banglatv/index.m3u8"
            }
          ]
        },
        {
          id: "bangla-vision",
          name: "Bangla Vision",
          shortName: "BV",
          logo: "assets/logos/bangla-vision.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/banglavision/index.m3u8"
            }
          ]
        },
        {
          id: "bijoy-tv",
          name: "Bijoy TV",
          shortName: "BIJOY",
          logo: "assets/logos/bijoy-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/bijoytv/index.m3u8"
            }
          ]
        },
        {
          id: "boishakhi-tv",
          name: "Boishakhi TV",
          shortName: "BOIS",
          logo: "assets/logos/boishakhi-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/boishakhitv/index.m3u8"
            },
            {
              label: "Auto",
              url: "https://boishakhi.sonarbanglatv.com/boishakhi/boishakhitv/index.m3u8"
            }
          ]
        },
        {
          id: "channel-9",
          name: "Channel 9",
          shortName: "CH9",
          logo: "assets/logos/channel-9.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1729/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/channel9/index.m3u8"
            }
          ]
        },
        {
          id: "channel-i",
          name: "Channel I",
          shortName: "CHI",
          logo: "assets/logos/channel-i.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/channeli/index.m3u8"
            }
          ]
        },
        {
          id: "deepto-tv",
          name: "Deepto TV",
          shortName: "DPTO",
          logo: "assets/logos/deepto-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/DeeptoTVHD/index.m3u8"
            }
          ]
        },
        {
          id: "gazi-tv",
          name: "Gazi TV",
          shortName: "GAZI",
          logo: "assets/logos/gazi-tv.png",
          quality: "HD",
          streams: [
            {
              label: "1080p",
              url: "http://tvn1.chowdhury-shaheb.com/gazitv/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8"
            }
          ]
        },
        {
          id: "global-tv",
          name: "Global TV",
          shortName: "GLB",
          logo: "assets/logos/global-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/globaltvhd/index.m3u8"
            }
          ]
        },
        {
          id: "maasranga-tv",
          name: "Maasranga TV",
          shortName: "MSTV",
          logo: "assets/logos/maasranga-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/maasrangatv/index.m3u8"
            }
          ]
        },
        {
          id: "mohona-tv",
          name: "Mohona TV",
          shortName: "MOHO",
          logo: "assets/logos/mohona-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-MohonaTV/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/mohonatv/index.m3u8"
            }
          ]
        },
        {
          id: "my-tv",
          name: "My TV",
          shortName: "MYTV",
          logo: "assets/logos/my-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/mytv/index.m3u8"
            }
          ]
        },
        {
          id: "ntv",
          name: "NTV",
          shortName: "NTV",
          logo: "assets/logos/ntv.svg",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/xV4jEKf3D9zc/index.m3u8"
            }
          ]
        },
        {
          id: "rtv",
          name: "RTV",
          shortName: "RTV",
          logo: "assets/logos/rtv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-RTV/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/RtvHD/index.m3u8"
            },
            {
              label: "480p",
              url: "http://tvn3.chowdhury-shaheb.com/rtv/index.m3u8"
            }
          ]
        },
        {
          id: "sa-tv",
          name: "SA TV",
          shortName: "SATV",
          logo: "assets/logos/sa-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/satv/index.m3u8"
            }
          ]
        },
        {
          id: "vokta-tv",
          name: "Vokta TV",
          shortName: "VKTA",
          logo: "assets/logos/vokta-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://vokta.raytahost.com/live/voktatv/index.m3u8"
            }
          ]
        }
      ]
    },
    {
      name: "Bangladesh Television",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\"/><line x1=\"6\" y1=\"18\" x2=\"6\" y2=\"11\"/><line x1=\"10\" y1=\"18\" x2=\"10\" y2=\"11\"/><line x1=\"14\" y1=\"18\" x2=\"14\" y2=\"11\"/><line x1=\"18\" y1=\"18\" x2=\"18\" y2=\"11\"/><polygon points=\"12 2 20 7 4 7\"/></svg>",
      channels: [
        {
          id: "btv-chattogram",
          name: "BTV Chattogram",
          shortName: "BTVC",
          logo: "assets/logos/btv-chattogram.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-BTVChattagram/index.m3u8"
            },
            {
              label: "480p",
              url: "https://tvsen6.aynaott.com/btvctg/index.m3u8"
            }
          ]
        },
        {
          id: "btv-national",
          name: "BTV National",
          shortName: "BTV",
          logo: "assets/logos/btv-national.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://www.btvlive.gov.bd/streams/ef8b8bbc-98b7-4ba7-a49d-a0adaf259d35/ES/355ba051-9a60-48aa-adcf-5a6c64da8c5c/355ba051-9a60-48aa-adcf-5a6c64da8c5c_3_playlist.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/btvhd/index.m3u8"
            }
          ]
        },
        {
          id: "btv-world",
          name: "BTV World",
          shortName: "BTVW",
          logo: "assets/logos/btv-world.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://www.btvlive.gov.bd/streams/ef8b8bbc-98b7-4ba7-a49d-a0adaf259d35/ES/d96eb7f4-83c2-4472-9597-3568390a8ebf/d96eb7f4-83c2-4472-9597-3568390a8ebf_3_playlist.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/btv_world/index.m3u8"
            }
          ]
        },
        {
          id: "sangsad-tv",
          name: "Sangsad TV",
          shortName: "SANG",
          logo: "assets/logos/sangsad-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/1709.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/BTVNews/index.m3u8"
            },
            {
              label: "480p",
              url: "https://bozztv.com/rongo/rongo-SangsadTV/index.m3u8"
            }
          ]
        }
      ]
    },
    {
      name: "Kids & Family",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/></svg>",
      channels: [
        {
          id: "duronto-tv",
          name: "Duronto TV",
          shortName: "DRNT",
          logo: "assets/logos/duronto-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p-2",
              url: "https://tvsen6.aynaott.com/durontotv-live/index.m3u8"
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/durontotv/index.m3u8"
            }
          ]
        },
        {
          id: "green-tv",
          name: "Green TV",
          shortName: "GRN",
          logo: "assets/logos/green-tv.jpg",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/playlist.m3u8"
            }
          ]
        }
      ]
    },
    {
      name: "Infotainment & Culture",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"23 7 16 12 23 17 23 7\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"/></svg>",
      channels: [
        {
          id: "atn-music",
          name: "ATN Music",
          shortName: "ATNM",
          logo: "assets/logos/atn-music.jpg",
          quality: "SD",
          streams: [
            {
              label: "360p",
              url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI/atnmusic.stream/playlist.m3u8"
            }
          ]
        },
        {
          id: "global-tv-music",
          name: "Global TV Music",
          shortName: "GLBM",
          logo: "assets/logos/global-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/globaltvhd/index.m3u8"
            }
          ]
        },
        {
          id: "movie-bangla",
          name: "Movie Bangla",
          shortName: "MBNGL",
          logo: "assets/logos/movie-bangla.jpg",
          quality: "SD",
          streams: [
            {
              label: "Auto",
              url: "http://alvetv.com/moviebanglatv/8080/index.m3u8"
            }
          ]
        }
      ]
    },
    {
      name: "Religious",
      icon: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>",
      channels: [
        {
          id: "al-quran-tv",
          name: "Al Quran Al Kareem TV",
          shortName: "QURAN",
          logo: "assets/logos/al-quran-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://aloula-redirect.vercel.app/7/playlist.m3u8"
            },
            {
              label: "720p",
              url: "http://m.live.net.sa:1935/live/quran/playlist.m3u8"
            },
            {
              label: "360p",
              url: "https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8"
            }
          ]
        },
        {
          id: "al-sunnah-tv",
          name: "Al Sunnah Al Nabawiyah TV",
          shortName: "SUNNAH",
          logo: "assets/logos/al-sunnah-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://aloula-redirect.vercel.app/6/playlist.m3u8"
            },
            {
              label: "720p",
              url: "http://m.live.net.sa:1935/live/sunnah/playlist.m3u8"
            },
            {
              label: "360p",
              url: "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8"
            }
          ]
        },
        {
          id: "madani-channel",
          name: "Madani Channel Bangla",
          shortName: "MCB",
          logo: "assets/logos/madani-channel.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://streaming.madanichannel.tv/static/streaming-playlists/hls/d3e49b76-ac06-4689-a641-9200445b647f/master.m3u8"
            }
          ]
        },
        {
          id: "peace-tv-bangla",
          name: "Peace TV Bangla",
          shortName: "PEACE",
          logo: "assets/logos/peace-tv-bangla.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://dzkyvlfyge.erbvr.com/PeaceTvBangla/index.m3u8"
            }
          ]
        },
        {
          id: "peace-tv-english",
          name: "Peace TV English",
          shortName: "PTVE",
          logo: "assets/logos/peace-tv-english.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8"
            }
          ]
        }
      ]
    }
  ]
};