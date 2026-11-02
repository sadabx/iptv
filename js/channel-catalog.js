/* ==========================================
   channel-catalog.js — Verified Curated IPTV channel catalogue
   Default 24/7 channels tested and active
   ========================================== */

var CHANNELS_DATA = {
  "categories": [
    {
      "name": "Sports",
      "channels": [
        {
          "id": "beinsports1",
          "name": "BeinSports-1",
          "shortName": "BS1",
          "logo": "assets/logos/beinsports-1.png",
          "streams": [
            {
              "label": "online24",
              "url": "http://ua.online24.pm/play/1101/350B326FB34F4B8/video.m3u8"
            },
            {
              "label": "StreamHost",
              "url": "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8"
            }
          ]
        },
        {
          "id": "fifa-plus",
          "name": "FIFA+",
          "shortName": "FIFA",
          "logo": "assets/logos/fifaplus.png",
          "streams": [
            {
              "label": "FIFA+",
              "url": "https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8"
            }
          ]
        },
        {
          "id": "fox-sports-501",
          "name": "Fox Sports 501 HD",
          "shortName": "FOX501",
          "logo": "assets/logos/fox-sports-501.svg",
          "streams": [
            {
              "label": "SiauliaiRS",
              "url": "http://sewv654wfcsdwfi87fwvgbngh.siauliairsavlt.pw/iptv/VCQ4ADX96VH4G8PY7URBWRQU/19146/index.m3u8"
            }
          ]
        },
        {
          "id": "t-sports",
          "name": "T Sports",
          "shortName": "TSPT",
          "logo": "assets/logos/tsports.png",
          "streams": [
            {
              "label": "rgkkw",
              "url": "http://rgkkw.live/live/1Aoen7elp5/IgMJ60tmAa/130714.ts"
            },
            {
              "label": "AynaOTT",
              "url": "https://tvsen7.aynaott.com/tsportsfhd/index.m3u8"
            }
          ]
        }
      ]
    },
    {
      "name": "News",
      "channels": [
        {
          "id": "dw-english",
          "name": "DW English",
          "shortName": "DW",
          "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png",
          "streams": [
            {
              "label": "Official HD",
              "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
            }
          ]
        },
        {
          "id": "desh-tv",
          "name": "Desh TV",
          "shortName": "DESH",
          "logo": "assets/logos/desh-tv.png",
          "streams": [
            {
              "label": "gpcdn",
              "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1724/output/index.m3u8"
            },
            {
              "label": "JagoBD",
              "url": "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/deshtv.stream/tracks-v1/mono.m3u8"
            }
          ]
        },
        {
          "id": "ekhon-tv",
          "name": "Ekhon TV",
          "shortName": "EKHON",
          "logo": "assets/logos/ekhon-tv.png",
          "streams": [
            {
              "label": "YouTube",
              "url": "https://www.youtube.com/live/fY9eJwH_qeg?si=8Ys6hVDGSObwQKuw"
            }
          ]
        },
        {
          "id": "jago-news-24",
          "name": "Jago News 24",
          "shortName": "JAGO",
          "logo": "assets/logos/jago-news-24.png",
          "streams": [
            {
              "label": "ncare",
              "url": "https://app.ncare.live/live-orgin/jagonews24.stream/playlist.m3u8"
            }
          ]
        },
        {
          "id": "jamuna-tv",
          "name": "Jamuna TV",
          "shortName": "JTV",
          "logo": "assets/logos/jamuna-tv.svg",
          "themeColor": "#AA0001",
          "streams": [
            {
              "label": "YouTube Live",
              "url": "https://www.youtube.com/embed/live_stream?channel=UCN6sm8iHiPd0cnoUardDAnw"
            },
            {
              "label": "Direct Live",
              "url": "https://www.youtube.com/watch?v=gEsujOKEDA8"
            }
          ]
        },
        {
          "id": "somoy-tv",
          "name": "Somoy TV",
          "shortName": "SOMOY",
          "logo": "assets/logos/somoy-tv.png",
          "streams": [
            {
              "label": "YouTube Live",
              "url": "https://www.youtube.com/embed/live_stream?channel=UCxHoBXkY88Tb8z1Ssj6CWsQ"
            },
            {
              "label": "Direct Live",
              "url": "https://www.youtube.com/watch?v=YCu5ZkiSqco"
            }
          ]
        }
      ]
    },
    {
      "name": "International",
      "channels": [
        {
          "id": "cna",
          "name": "CNA",
          "shortName": "CNA",
          "logo": "assets/logos/cna.svg",
          "streams": [
            {
              "label": "CloudFront",
              "url": "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_5.m3u8"
            }
          ]
        },
        {
          "id": "cnn-us",
          "name": "CNN",
          "shortName": "CNN ",
          "logo": "assets/logos/cnn-us.svg",
          "streams": [
            {
              "label": "WarnerMedia",
              "url": "https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8"
            }
          ]
        }
      ]
    },
    {
      "name": "General",
      "channels": [
        {
          "id": "ananda-tv",
          "name": "Ananda TV",
          "shortName": "AND",
          "logo": "assets/logos/ananda-tv.png",
          "streams": [
            {
              "label": "JagoBD",
              "url": "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/anandatv.stream/tracks-v1a1/mono.m3u8"
            }
          ]
        },
        {
          "id": "deepto-tv",
          "name": "Deepto TV",
          "shortName": "DPTO",
          "logo": "assets/logos/deepto-tv.png",
          "streams": [
            {
              "label": "gpcdn",
              "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8"
            },
            {
              "label": "gpcdn",
              "url": "https://byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8"
            }
          ]
        },
        {
          "id": "ekushey-tv",
          "name": "Ekushey TV",
          "shortName": "ETV",
          "logo": "assets/logos/ekushey-tv.png",
          "streams": [
            {
              "label": "EkusheyServ",
              "url": "https://ekusheyserver.com/etvlivesn.m3u8"
            },
            {
              "label": "AynaOTT",
              "url": "https://tvsen6.aynaott.com/etv/index.m3u8"
            }
          ]
        },
        {
          "id": "movie-bangla",
          "name": "Movie Bangla",
          "shortName": "MBNGL",
          "logo": "assets/logos/movie-bangla.jpg",
          "streams": [
            {
              "label": "AlveTV",
              "url": "http://alvetv.com/moviebanglatv/8080/index.m3u8"
            }
          ]
        },
        {
          "id": "ntv",
          "name": "NTV",
          "shortName": "NTV",
          "themeColor": "#00833e",
          "logo": "assets/logos/ntv.svg",
          "streams": [
            {
              "label": "gpcdn",
              "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8"
            },
            {
              "label": "AynaOTT",
              "url": "https://tvsen5.aynaott.com/xV4jEKf3D9zc/index.m3u8"
            }
          ]
        },
        {
          "id": "srk-tv",
          "name": "SRK TV",
          "shortName": "SRK",
          "logo": "assets/logos/srk-tv.png",
          "themeColor": "#0134FE",
          "streams": [
            {
              "label": "ncare",
              "url": "https://srknowapp.ncare.live/srktvhlswodrm/srktv.stream/playlist.m3u8"
            }
          ]
        }
      ]
    },
    {
      "name": "Indian",
      "channels": [
        {
          "id": "hindi-movies",
          "name": "Hindi Movies",
          "shortName": "HIND",
          "themeColor": "#000000",
          "logo": "assets/logos/hindi-movies.png",
          "streams": [
            {
              "label": "BozzTV",
              "url": "https://live20.bozztv.com/giatvplayout7/giatv-209612/tracks-v1a1/mono.ts.m3u8"
            }
          ]
        },
        {
          "id": "joo-music",
          "name": "Joo Music",
          "shortName": "JOOM",
          "logo": "assets/logos/joo-music.png",
          "streams": [
            {
              "label": "live247",
              "url": "https://livecdn.live247stream.com/joomusic/tv/playlist.m3u8"
            }
          ]
        },
        {
          "id": "sheemaroo-bollywood",
          "name": "Sheemaroo Bollywood",
          "shortName": "SHEE",
          "logo": "assets/logos/sheemaroo-bollywood.png",
          "streams": [
            {
              "label": "Amagi",
              "url": "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg00864-shemarooenterta-shemabollywood-ono/playlist.m3u8"
            }
          ]
        },
        {
          "id": "star-jalsha-hd",
          "name": "Star Jalsha HD",
          "shortName": "JALSHA",
          "logo": "assets/logos/star-jalsha-hd.png",
          "streams": [
            {
              "label": "YuppTV",
              "url": "https://catchup.yuppcdn.net/amazonv2/36/preview/starjalsha/master/chunklist.m3u8"
            },
            {
              "label": "AynaOTT",
              "url": "https://tvsen3.aynaott.com/n64PH4YL/tracks-v1a1/mono.ts.m3u8"
            }
          ]
        },
        {
          "id": "zee-bangla-hd",
          "name": "Zee Bangla HD",
          "shortName": "ZEEB",
          "logo": "assets/logos/zee-bangla-hd.png",
          "streams": [
            {
              "label": "OTTPlus",
              "url": "https://stream.ottplus.bd/live/zee_bangla_abr/live/zee_bangla_720/chunks.m3u8"
            },
            {
              "label": "YuppTV",
              "url": "https://catchup.yuppcdn.net/amazonv2/36/preview/zeebangla/master/chunklist.m3u8"
            },
            {
              "label": "EPGMaker",
              "url": "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/536.ts"
            }
          ]
        }
      ]
    },
    {
      "name": "Kids",
      "channels": [
        {
          "id": "cartoon-network",
          "name": "Cartoon Network",
          "shortName": "CN",
          "logo": "assets/logos/cartoon-network.png",
          "streams": [
            {
              "label": "OTTPlus",
              "url": "https://stream.ottplus.bd/live/cn_sd_abr/live/cn_sd/chunks.m3u8"
            },
            {
              "label": "mJunoon",
              "url": "https://vodzong.mjunoon.tv:8087/streamtest/cartoon-network-87/live/87H/chunks.m3u8"
            }
          ]
        },
        {
          "id": "motu-patlu",
          "name": "Motu Patlu",
          "shortName": "MOTU",
          "logo": "assets/logos/motu-patlu.png",
          "streams": [
            {
              "label": "BozzTV",
              "url": "https://live20.bozztv.com/giatvplayout7/giatv-209622/tracks-v1a1/mono.ts.m3u8"
            }
          ]
        },
        {
          "id": "mr-bean",
          "name": "Mr Bean",
          "shortName": "BEAN",
          "logo": "assets/logos/mr-bean.png",
          "streams": [
            {
              "label": "Amagi",
              "url": "https://amg00627-amg00627c29-rakuten-it-3989.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg00627-banijayfast-mrbeanitcc-rakutenit/cb573e196573618984c83c61cef04682ad7b3dcb0e6c886470af4a9765d9775884b7e1bfb415aa204cd717d80e0c695a4d258d13df7900d9de63b826612f4c2b859ab27ad9991309b3c8797368e62c4119e10f10d13b53309dec490cd065b429005ebe513f047fdcec0fac6b03c6d40d962c7c8eadd5373d7e5e599f093f5d916487c724993cf25ed3c50e72e77e1bb0de139d815fe3a2eb61ac32e5566ac050a0dabfa253dbd7bb5891be291c7b3d0675988b78d1be350d74ab1b58bf0b46621654eda2d3da472a8f544a53f6bda4d7df5122bceb74d21a529f089944857aec01ce58f5b119f2edd3db3381d07445d2c470809cace362f5344a50dbe883fc607598b9307046c26ce234411ebdf2d11d88cf14d9e36dd5f421256991ca05b794bc96f7f09512ca1a9c93afd82f5414325153c80debda4ade2ad677e79c43700c1d15fdcb15e28fcb5b366d57c9d10b855d4bcbbce1e6f30735df7861198207f4541f65c0386d068a0bf088396a863e4ac87511f2562098009b9c29e6accfea1631d78d91a29ecf326ebbb4e345aae9781f7f4d488eea87d4da82a6/36/1920x1080_6046040/index.m3u8"
            }
          ]
        },
        {
          "id": "pbs-kids",
          "name": "PBS Kids",
          "shortName": "PBSK",
          "logo": "assets/logos/pbs-kids.png",
          "themeColor": "#2135C5",
          "streams": [
            {
              "label": "StreamHost",
              "url": "https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8"
            },
            {
              "label": "StreamHost",
              "url": "https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8?DVR"
            }
          ]
        },
        {
          "id": "popkids",
          "name": "Popkids",
          "shortName": "POP",
          "logo": "assets/logos/popkids.png",
          "streams": [
            {
              "label": "Amagi",
              "url": "https://amg01753-narrativeentert-popkids-lggb-xyy5k.amagi.tv/ts-eu-w1-n2/playlist/amg01753-narrativeentert-popkids-lggb/cb543d187b6c678b9ad43e6fd6ef43a2f9591fde1d6988693eb5518975d1073edce2a59caa08ff16388f1ede7f0a66413a3e951fda77118fd87eb141453c5728cfffe729a2c05616b7db083429b56a062a866a68ac39437ed0e21f48a238b6720a5aa82a66443d80b846ac7254db80148b61299bce8c37683f03409a5e5afba358b1ebe8084dd83aa4e51555972617e79f43c8821da6d2d50a9b5e8227a5429993f0dad143d380f359936790547338681dcbe0435ea837b9f7957330907d29094b1bb6e3dbc947328248544fb8d1ffff34af5d9ed265b66939ed54c30f9c66de22ea28b7f142a59abedd69482deb91083669f3b3e0c2d01d07904ab7e2e5d47879d9d1117b4cc6249801232a9ff0ce5bd59743d8e66dd5fa395d0bc197448994fdd6bce7c319ca57bfad9eaf344c4a6c1311c60cf2e80af51d9d29f880435b1f27228a955ac38adc24404147948f53d15356f9ec828ddb012cd9227c7eed73d24f0a7cc6573d2eb7cd986fb6942740333f17bae0653a8484fd686c6072f311/122/1920x1080_5903040/index.m3u8"
            }
          ]
        },
        {
          "id": "rongeen-tv",
          "name": "Rongeen TV",
          "shortName": "RNGN",
          "logo": "assets/logos/rongeen-tv.png",
          "streams": [
            {
              "label": "LegitPro",
              "url": "https://server.thelegitpro.in/rongeentv/rongeentv/tracks-v1a1/mono.m3u8"
            }
          ]
        },
        {
          "id": "tom-jerry",
          "name": "Tom & Jerry",
          "shortName": "T&J ",
          "logo": "assets/logos/tom-jerry.png",
          "streams": [
            {
              "label": "BozzTV",
              "url": "https://live20.bozztv.com/giatvplayout7/giatv-208314/tracks-v1a1/mono.ts.m3u8"
            },
            {
              "label": "BozzTV-2",
              "url": "https://live20.bozztv.com/giatvplayout7/giatv-208314/playlist.m3u8"
            }
          ]
        }
      ]
    },
    {
      "name": "Infotainment",
      "channels": [
        {
          "id": "nasa-tv-hd",
          "name": "NASA TV HD",
          "shortName": "NASA",
          "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png",
          "streams": [
            {
              "label": "Official HD",
              "url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8"
            }
          ]
        },
        {
          "id": "motor-vision",
          "name": "Motor Vision",
          "shortName": "MOTO",
          "logo": "assets/logos/motor-vision.png",
          "streams": [
            {
              "label": "OtterVision",
              "url": "https://mvg-mv-xumo.otteravision.com/mvg/mv/mv.m3u8"
            }
          ]
        },
        {
          "id": "real-wild",
          "name": "REAL WILD",
          "shortName": "REAL",
          "logo": "assets/logos/wild-tv.png",
          "streams": [
            {
              "label": "Amagi",
              "url": "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00426-littledotstudio-realwild-tcl/playlist.m3u8"
            }
          ]
        },
        {
          "id": "red-bull-tv",
          "name": "Red Bull TV",
          "shortName": "RBTV",
          "logo": "assets/logos/red-bull-tv.svg",
          "streams": [
            {
              "label": "Akamai",
              "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8"
            }
          ]
        },
        {
          "id": "travel-xp",
          "name": "Travel XP",
          "shortName": "TRXP",
          "logo": "assets/logos/travel-xp.svg",
          "streams": [
            {
              "label": "Rakuten",
              "url": "https://travelxp-travelxp-1-eu.rakuten.wurl.tv/playlist.m3u8"
            },
            {
              "label": "Samsung",
              "url": "https://travelxp-travelxp-1-nz.samsung.wurl.tv/playlist.m3u8"
            }
          ]
        },
        {
          "id": "wild-earth",
          "name": "Wild Earth",
          "shortName": "WE",
          "logo": "assets/logos/wild-earth.png",
          "streams": [
            {
              "label": "Amagi",
              "url": "https://wildearth-plex.amagi.tv/masterR720P.m3u8"
            }
          ]
        }
      ]
    },
    {
      "name": "Religious",
      "channels": [
        {
          "id": "al-quran-tv",
          "name": "Al Quran Al Kareem TV",
          "shortName": "MAKKA",
          "logo": "assets/logos/al-quran-tv.png",
          "streams": [
            {
              "label": "gpcdn",
              "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1713/output/index.m3u8"
            },
            {
              "label": "SaudiLive",
              "url": "http://m.live.net.sa:1935/live/quran/playlist.m3u8"
            },
            {
              "label": "Akamai",
              "url": "https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8"
            }
          ]
        },
        {
          "id": "al-sunnah-tv",
          "name": "Al Sunnah Al Nabawiyah TV",
          "shortName": "MADINA",
          "logo": "assets/logos/al-sunnah-tv.png",
          "streams": [
            {
              "label": "SaudiLive",
              "url": "http://m.live.net.sa:1935/live/sunnah/playlist.m3u8"
            },
            {
              "label": "Akamai",
              "url": "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8"
            }
          ]
        },
        {
          "id": "madani-channel",
          "name": "Madani Channel Bangla",
          "shortName": "MCB",
          "logo": "assets/logos/madani-channel.png",
          "streams": [
            {
              "label": "MadaniTV",
              "url": "https://streaming.madanichannel.tv/static/streaming-playlists/hls/d3e49b76-ac06-4689-a641-9200445b647f/master.m3u8"
            }
          ]
        },
        {
          "id": "peace-tv-bangla",
          "name": "Peace TV Bangla",
          "shortName": "PEACE",
          "logo": "assets/logos/peace-tv-bangla.png",
          "streams": [
            {
              "label": "erbvr",
              "url": "https://dzkyvlfyge.erbvr.com/PeaceTvBangla/index.m3u8"
            }
          ]
        },
        {
          "id": "peace-tv-english",
          "name": "Peace TV English",
          "shortName": "PTVE",
          "logo": "assets/logos/peace-tv-english.png",
          "streams": [
            {
              "label": "erbvr",
              "url": "https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8"
            }
          ]
        },
        {
          "id": "quran-tv",
          "name": "Quran TV",
          "shortName": "Q24",
          "logo": "assets/logos/quran-tv.png",
          "themeColor": "#f3e779ee",
          "streams": [
            {
              "label": "Sharjah Quran",
              "url": "https://live.kwikmotion.com/sharjahtvquranlive/shqurantv.smil/playlist.m3u8"
            },
            {
              "label": "SMC Radio",
              "url": "https://live.kwikmotion.com/smcquranlive/quranradiolive/playlist.m3u8"
            }
          ]
        }
      ]
    }
  ]
};

window.CHANNELS_DATA = CHANNELS_DATA;
window.DEFAULT_CHANNELS_DATA = JSON.parse(JSON.stringify(CHANNELS_DATA));
