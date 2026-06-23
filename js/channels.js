/* ==========================================
   channels.js — IPTV Channel Mapping Database
   ========================================== */

const CHANNELS_DATA = {
  categories: [
    {
      name: "Sports",
      channels: [
        {
          id: "beinsports1",
          name: "BeinSports-1",
          shortName: "BS1",
          logo: "assets/logos/beinsports-1.png",
          quality: "FHD",
          streams: [
            {
              label: "online24",
              url: "http://ua.online24.pm/play/1101/350B326FB34F4B8/video.m3u8",
            },
            {
              label: "StreamHost",
              url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8",
            },
            {
              label: "BeIN-IR",
              url: "https://edge22.776740.ir.cdn.ir/hls2/sport.m3u8 ",
            },
          ],
        },
        {
          id: "eurosport-hd",
          name: "Eurosport HD",
          shortName: "EURO",
          logo: "assets/logos/eurosport-hd.png",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://151.80.18.177:86/Eurosport_HD/index.m3u8",
            },
          ],
        },
        {
          id: "f1-tv",
          name: "F1 TV",
          shortName: "F1TV",
          logo: "assets/logos/f1-tv.png",
          quality: "HD",
          streams: [
            {
              label: "Hakunamatata",
              url: "https://hakunamatata5.org:8088/hls/sky-f1.m3u8",
            },
          ],
        },
        {
          id: "fifa-wc-2026",
          name: "FIFA 26",
          shortName: "FIFA",
          logo: "assets/logos/fifa-wc-2026.svg",
          quality: "FHD",
          streams: [
            {
              label: "StreamHost",
              url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8",
            },
            {
              label: "FawaTV",
              url: "https://fawatv.online/live/F2E62CEFFF6C6F88C237BD9DF4957C35/667.m3u8",
            },
            {
              label: "BeIN-IR",
              url: "https://edge22.776740.ir.cdn.ir/hls2/sport.m3u8 ",
            },
            {
              label: "FIFA+",
              url: "https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8",
            },
            /*
            {
              label: "Kooran",
              url: "https://live.kooran51.cfd/yorrr1/index.m3u8",
            },
            */
          ],
        },
        {
          id: "fox-sports-501",
          name: "Fox Sports 501 HD",
          shortName: "FOX501",
          logo: "assets/logos/fox-sports-501.svg",
          quality: "HD",
          streams: [
            {
              label: "SiauliaiRS",
              url: "http://sewv654wfcsdwfi87fwvgbngh.siauliairsavlt.pw/iptv/VCQ4ADX96VH4G8PY7URBWRQU/19146/index.m3u8",
            },
          ],
        },
        {
          id: "sky-sports-cricket",
          name: "Sky Sports Cricket",
          shortName: "SKY",
          logo: "assets/logos/sky-sports-cricket.svg",
          quality: "HD",
          streams: [
            {
              label: "SiauliaiRS",
              url: "http://sewv654wfcsdwfi87fwvgbngh.siauliairsavlt.pw/iptv/VCQ4ADX96VH4G8PY7URBWRQU/9258/index.m3u8",
            },
          ],
        },
        {
          id: "sony-sports-2",
          name: "Sony Sports 2 HD",
          shortName: "SS2",
          logo: "assets/logos/sony-sports-2.png",
          quality: "HD",
          streams: [
            {
              label: "EPGMaker",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/513.ts",
            },
          ],
        },
        {
          id: "sony-sports-5",
          name: "Sony Sports 5",
          shortName: "SS5",
          logo: "assets/logos/sony-sports-5.png",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://66.102.126.10:8000/play/a010/index.m3u8",
            },
          ],
        },
        {
          id: "sport-tv1",
          name: "Sport TV",
          shortName: "STV1",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Sport_TV1_%282023%29.svg",
          quality: "HD",
          streams: [
            {
              label: "StreamHost",
              url: "https://1nyaler.streamhostingcdn.top/stream/33/index.m3u8",
            },
          ],
        },
        {
          id: "fox-5",
          name: "Fox 5",
          shortName: "Fox-5",
          logo: "https://images.squarespace-cdn.com/content/v1/5d853c9bd277641ad03a954e/1602625218587-ELV3ORCIQOQ5ORCE0XAS/FOx5news.png",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://84.17.50.102/fox/index.m3u8",
            },
          ],
        },
        {
          id: "star-sports-1",
          name: "Star Sports 1",
          shortName: "SS1H",
          logo: "assets/logos/star-sports-1.png",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://202.70.146.135:8000/play/a01e/index.m3u8",
            },
            {
              label: "Direct",
              url: "http://41.205.93.154/STARSPORTS1/index.m3u8",
            },
          ],
        },
        {
          id: "t-sports",
          name: "T Sports",
          shortName: "TSPT",
          logo: "assets/logos/tsports.png",
          quality: "HD",
          streams: [
            {
              label: "rgkkw",
              url: "http://rgkkw.live/live/1Aoen7elp5/IgMJ60tmAa/130714.ts",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen7.aynaott.com/tsportsfhd/index.m3u8",
            },
          ],
        },
        {
          id: "thunder-er",
          name: "Thunder Er",
          shortName: "THUN",
          logo: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770380791303.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://nomawnoijl.gpcdn.net/akash/thunder/playlist.m3u8",
            },
          ],
        },
        {
          id: "tnt-sports",
          name: "TNT Sports",
          shortName: "TNT",
          logo: "https://abusaeeidx.github.io/Tv-Channel-Logo/CricHD/runded/tnt.png",
          quality: "HD",
          streams: [
            {
              label: "StreamHost",
              url: "https://1nyaler.streamhostingcdn.top/stream/30/index.m3u8",
            },
          ],
        },
        {
          id: "willow-sports",
          name: "Willow Sports",
          shortName: "WLOW",
          logo: "assets/logos/willow-sports.svg",
          quality: "FHD",
          streams: [
            {
              label: "EPGMaker",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/517.ts",
            },
          ],
        },
      ],
    },
    {
      name: "News",
      channels: [
        {
          id: "atn-news",
          name: "ATN News",
          shortName: "ATNN",
          logo: "assets/logos/atn-news.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8",
            },
          ],
        },
        {
          id: "channel-1",
          name: "Channel 1",
          shortName: "CH1",
          logo: "assets/logos/channel-1.svg",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8",
            },
          ],
        },
        {
          id: "channel-24",
          name: "Channel 24",
          shortName: "CH24",
          logo: "assets/logos/channel-24.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8",
            },
            {
              label: "BozzTV",
              url: "https://bozztv.com/rongo/rongo-Channel24HD/index.m3u8",
            },
          ],
        },
        {
          id: "dbc-news",
          name: "DBC News",
          shortName: "DBC",
          logo: "assets/logos/dbc-news.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8",
            },
          ],
        },
        {
          id: "desh-tv",
          name: "Desh TV",
          shortName: "DESH",
          logo: "assets/logos/desh-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1724/output/index.m3u8",
            },
            {
              label: "JagoBD",
              url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/deshtv.stream/tracks-v1/mono.m3u8",
            },
          ],
        },
        {
          id: "ekattor-tv",
          name: "Ekattor TV",
          shortName: "71TV",
          logo: "assets/logos/ekattor-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8",
            },
          ],
        },
        {
          id: "ekhon-tv",
          name: "Ekhon TV",
          shortName: "EKHON",
          logo: "assets/logos/ekhon-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "YouTube",
              url: "https://www.youtube.com/live/PRvnQNOaTFg?si=eso9StsMEEnoIZ2K",
            },
          ],
        },
        {
          id: "independent-tv",
          name: "Independent TV",
          shortName: "ITV",
          logo: "assets/logos/independent-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8",
            },
          ],
        },
        {
          id: "jago-news-24",
          name: "Jago News 24",
          shortName: "JAGO",
          logo: "assets/logos/jago-news-24.png",
          quality: "HD",
          streams: [
            {
              label: "ncare",
              url: "https://app.ncare.live/live-orgin/jagonews24.stream/playlist.m3u8",
            },
          ],
        },
        {
          id: "jamuna-tv",
          name: "Jamuna TV",
          shortName: "JTV",
          logo: "assets/logos/jamuna-tv.svg",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8",
            },
            {
              label: "YouTube",
              url: "https://www.youtube.com/live/0mWPK8U8jo0?si=PvmDqAuISJsC3Oxw",
            },
          ],
        },
        {
          id: "news-24",
          name: "News 24",
          shortName: "N24",
          logo: "assets/logos/news-24.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/index.m3u8",
            },
          ],
        },
        {
          id: "sangsad-tv",
          name: "Sangsad TV",
          shortName: "SANG",
          logo: "assets/logos/sangsad-tv.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
            },
          ],
        },
        {
          id: "somoy-tv",
          name: "Somoy TV",
          shortName: "SOMOY",
          logo: "assets/logos/somoy-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "BossTV",
              url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8",
            },
            {
              label: "YouTube",
              url: "https://youtu.be/ITx_k7uNFP4",
            },
          ],
        },
        {
          id: "star-news",
          name: "Star News",
          shortName: "STAR",
          logo: "assets/logos/star-news.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "International",
      channels: [
        {
          id: "al-jazeera",
          name: "Al Jazeera English",
          shortName: "AJE",
          logo: "assets/logos/al-jazeera.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1721/output/index.m3u8",
            },
          ],
        },
        {
          id: "cna",
          name: "CNA",
          shortName: "CNA",
          logo: "assets/logos/cna.svg",
          quality: "HD",
          streams: [
            {
              label: "CloudFront",
              url: "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_5.m3u8",
            },
          ],
        },
        {
          id: "cnn-us",
          name: "CNN",
          shortName: "CNN ",
          logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg",
          quality: "HD",
          streams: [
            {
              label: "WarnerMedia",
              url: "https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8",
            },
          ],
        },
        {
          id: "press-tv-iran",
          name: "Press TV Iran",
          shortName: "PRES",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Press_TV_logo.svg/1280px-Press_TV_logo.svg.png",
          quality: "HD",
          streams: [
            {
              label: "PressTV",
              url: "https://live.presstv.ir/hls/presstv_5_482/index.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "General",
      channels: [
        {
          id: "ananda-tv",
          name: "Ananda TV",
          shortName: "AND",
          logo: "assets/logos/ananda-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "JagoBD",
              url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/anandatv.stream/tracks-v1a1/mono.m3u8",
            },
          ],
        },
        /*
        {
          id: "asian-tv",
          name: "Asian TV",
          shortName: "ASIAN",
          logo: "assets/logos/asian-tv.png",
          quality: "HD",
          streams: [
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/asiantv/index.m3u8",
            },
          ],
        },
        {
          id: "atn-bangla",
          name: "ATN Bangla",
          shortName: "ATNB",
          logo: "assets/logos/atn-bangla.svg",
          quality: "HD",
          streams: [
            {
              label: "AynaOTT",
              url: "https://tvsen5.aynaott.com/atnbangla/index.m3u8",
            },
          ],
        },
        */
        {
          id: "atn-music",
          name: "ATN Music",
          shortName: "ATN ",
          logo: "assets/logos/atn-music.jpg",
          quality: "HD",
          streams: [
            {
              label: "ncare",
              url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI/atnmusic.stream/playlist.m3u8",
            },
          ],
        },
        /*
        {
          id: "bangla-tv",
          name: "Bangla TV",
          shortName: "BNG",
          logo: "assets/logos/bangla-tv.png",
          quality: "HD",
          streams: [
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/banglatv/index.m3u8",
            },
          ],
        },
        */
        {
          id: "bangla-vision",
          name: "Bangla Vision",
          shortName: "BV",
          logo: "assets/logos/bangla-vision.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/index.m3u8",
            },
          ],
        },
        {
          id: "bijoy-tv",
          name: "Bijoy TV",
          shortName: "BIJOY",
          logo: "assets/logos/bijoy-tv.png",
          quality: "HD",
          streams: [
            {
              label: "EPGMaker",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/581.ts",
            },
          ],
        },
        {
          id: "boishakhi-tv",
          name: "Boishakhi TV",
          shortName: "BOIS",
          logo: "assets/logos/boishakhi-tv.png",
          quality: "HD",
          streams: [
            {
              label: "SonarBangla",
              url: "https://boishakhi.sonarbanglatv.com/boishakhi/boishakhitv/index.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/boishakhitv/index.m3u8",
            },
          ],
        },
        {
          id: "channel-9",
          name: "Channel 9",
          shortName: "CH9",
          logo: "assets/logos/channel-9.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1729/output/index.m3u8",
            },
          ],
        },
        {
          id: "channel-i",
          name: "Channel I",
          shortName: "CHI",
          logo: "assets/logos/channel-i.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8",
            },
          ],
        },
        {
          id: "deepto-tv",
          name: "Deepto TV",
          shortName: "DPTO",
          logo: "assets/logos/deepto-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8",
            },
            {
              label: "gpcdn",
              url: "https://byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8",
            },

          ],
        },
        {
          id: "ekushey-tv",
          name: "Ekushey TV",
          shortName: "ETV",
          logo: "assets/logos/ekushey-tv.png",
          quality: "HD",
          streams: [
            {
              label: "EkusheyServ",
              url: "https://ekusheyserver.com/etvlivesn.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/etv/index.m3u8",
            },
          ],
        },
        /*
        {
          id: "gazi-tv",
          name: "Gazi TV",
          shortName: "GTV",
          logo: "assets/logos/gazi-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "ChowdhuryS",
              url: "http://tvn1.chowdhury-shaheb.com/gazitv/index.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8",
            },
            {
              label: "SonyPlex",
              url: "https://ott.sonyplex.com:444/play/EDI0B4ME7MUUyw-g59yLM4a9ZIbC6ZQPO9Uw1syBicM/m3u8",
            },
          ],
        },
        {
          id: "global-tv",
          name: "Global TV",
          shortName: "GLB",
          logo: "assets/logos/global-tv.png",
          quality: "HD",
          streams: [
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/globaltvhd/index.m3u8",
            },
          ],
        },
        {
          id: "green-tv",
          name: "Green TV",
          shortName: "GRN",
          logo: "assets/logos/green-tv.jpg",
          quality: "FHD",
          streams: [
            {
              label: "ncare",
              url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/playlist.m3u8",
            },

          ],
        },
        */
        {
          id: "maasranga-tv",
          name: "Maasranga TV",
          shortName: "MSTV",
          logo: "assets/logos/maasranga-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8",
            },
          ],
        },
        {
          id: "mohona-tv",
          name: "Mohona TV",
          shortName: "MOHO",
          logo: "assets/logos/mohona-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "BozzTV",
              url: "https://bozztv.com/rongo/rongo-MohonaTV/index.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/mohonatv/index.m3u8",
            },
          ],
        },
        {
          id: "movie-bangla",
          name: "Movie Bangla",
          shortName: "MBNGL",
          logo: "assets/logos/movie-bangla.jpg",
          quality: "SD",
          streams: [
            {
              label: "AlveTV",
              url: "http://alvetv.com/moviebanglatv/8080/index.m3u8",
            },
          ],
        },
        /*
        {
          id: "my-tv",
          name: "My TV",
          shortName: "MYTV",
          logo: "assets/logos/my-tv.png",
          quality: "HD",
          streams: [
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/mytv/index.m3u8",
            },
          ],
        },
        */
        {
          id: "ntv",
          name: "NTV",
          shortName: "NTV",
          logo: "assets/logos/ntv.svg",
          quality: "FHD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen5.aynaott.com/xV4jEKf3D9zc/index.m3u8",
            },
          ],
        },
        /*
        {
          id: "rtv",
          name: "RTV",
          shortName: "RTV",
          logo: "assets/logos/rtv.png",
          quality: "FHD",
          streams: [
            {
              label: "Direct",
              url: "http://116.204.149.16/rtvhd/index.m3u8",
            },
            {
              label: "BozzTV",
              url: "https://bozztv.com/rongo/rongo-RTV/index.m3u8",
            },
          ],
        },
        */
        {
          id: "sa-tv",
          name: "SA TV",
          shortName: "SATV",
          logo: "assets/logos/sa-tv.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1720/output/index.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen6.aynaott.com/satv/index.m3u8",
            },
          ],
        },
        /*
        {
          id: "vokta-tv",
          name: "Vokta TV",
          shortName: "VKTA",
          logo: "assets/logos/vokta-tv.png",
          quality: "HD",
          streams: [
            {
              label: "RaytaHost",
              url: "https://vokta.raytahost.com/live/voktatv/index.m3u8",
            },
          ],
        },
        */
      ],
    },
    {
      name: "Entertainment",
      channels: [
        {
          id: "crimes",
          name: "Crimes",
          shortName: "CRIM",
          logo: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770380126540.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://nomawnoijl.gpcdn.net/akash/crimes/playlist.m3u8",
            },
          ],
        },
        {
          id: "moviebox",
          name: "Moviebox",
          shortName: "MBBX",
          logo: "https://w7.pngwing.com/pngs/686/422/png-transparent-black-clap-board-illustration-film-festival-world-cinema-box-office-movie-miscellaneous-television-angle-thumbnail.png",
          quality: "HD",
          streams: [
            {
              label: "SkyGo",
              url: "https://cdn1.skygo.mn/live/disk1/Moviebox/HLS-FTA/Moviebox.m3u8",
            },
          ],
        },
        {
          id: "superrix-hd",
          name: "Superrix HD",
          shortName: "SPRX",
          logo: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770348388925.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://nomawnoijl.gpcdn.net/akash/superrix/playlist.m3u8",
            },
          ],
        },
        {
          id: "uniques-hd",
          name: "Uniques HD",
          shortName: "UNIQ",
          logo: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770347327658.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://nomawnoijl.gpcdn.net/akash/uniques/playlist.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "Indian",
      channels: [
        {
          id: "aakash-aath",
          name: "Aakash Aath",
          shortName: "AKA",
          logo: "assets/logos/akash-aat.webp",
          quality: "HD",
          streams: [
            {
              label: "BossTV",
              url: "https://live.thebosstv.com:30443/dwlive/AAKAASH-AATH/chunks.m3u8",
            },
            {
              label: "PiShow",
              url: "https://cdn-4.pishow.tv/live/969/master.m3u8",
            },
          ],
        },
        {
          id: "b4u-kadak",
          name: "B4U Kadak",
          shortName: "B4U ",
          logo: "https://jiotvimages.cdn.jio.com/dare_images/images/channel/63ca523d57c534aae4b50f9cd4d2a80c.png",
          quality: "HD",
          streams: [
            {
              label: "PiShow",
              url: "https://cdn-2.pishow.tv/live/227/master.m3u8",
            },
          ],
        },
        {
          id: "colors-bangla-hd",
          name: "Colors Bangla HD",
          shortName: "COLORS",
          logo: "assets/logos/colors-bangla-hd.png",
          quality: "FHD",
          streams: [
            {
              label: "EPGMaker",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/532.ts",
            },
          ],
        },
        /*
        {
          id: "colors-cineplex-hd",
          name: "Colors Cineplex HD",
          shortName: "CINEPLEX",
          logo: "assets/logos/colors-cineplex-hd.svg",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://66.102.126.10:8000/play/a076/index.m3u8",
            },
          ],
        },
        */
        {
          id: "hindi-movies",
          name: "Hindi Movies",
          shortName: "HIND",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVljpzM91S8pNCK2WqHvoPOIbH80C0BJS6QQ&s",
          quality: "HD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209612/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "joo-music",
          name: "Joo Music",
          shortName: "JOOM",
          logo: "https://images.dwncdn.net/images/t_app-icon-l/p/2465677d-f07e-4f7e-90b0-74fb1d636456/2541171815/2141_4-78144111-imgingest-1692757708225709462.png",
          quality: "HD",
          streams: [
            {
              label: "live247",
              url: "https://livecdn.live247stream.com/joomusic/tv/playlist.m3u8",
            },
          ],
        },
        {
          id: "sheemaroo-bollywood",
          name: "Sheemaroo Bollywood",
          shortName: "SHEE",
          logo: "https://jiotvimages.cdn.jio.com/dare_images/images/channel/2f66f13b85531977f2990c18ca414e83.png",
          quality: "HD",
          streams: [
            {
              label: "Amagi",
              url: "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg00864-shemarooenterta-shemabollywood-ono/playlist.m3u8",
            },
          ],
        },
        /*
        {
          id: "sony-aath",
          name: "Sony AATH",
          shortName: "AATH",
          logo: "assets/logos/sony-aath.png",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://45.127.56.3:9698/live/Corpus-POL/SRV4/1/SONY-AATH/video.m3u8",
            },
          ],
        },
        */
        {
          id: "sony-max",
          name: "Sony Max",
          shortName: "MAX",
          logo: "assets/logos/sony-max.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/sony_max_sd_abr/live/sony_max_sd_720/chunks.m3u8",
            },
          ],
        },
        {
          id: "sony-sab",
          name: "Sony SAB",
          shortName: "SAB",
          logo: "assets/logos/sony-sab.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/sub_hd_abr/live/sony_sub_hd_720/chunks.m3u8",
            },
          ],
        },
        {
          id: "star-bharat",
          name: "Star Bharat",
          shortName: "SB",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Star_Bharat_Logo.png/250px-Star_Bharat_Logo.png",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://66.102.126.10:8000/play/a022/index.m3u8",
            },
          ],
        },
        {
          id: "star-jalsha-hd",
          name: "Star Jalsha HD",
          shortName: "JALSHA",
          logo: "assets/logos/star-jalsha-hd.png",
          quality: "FHD",
          streams: [
            {
              label: "YuppTV",
              url: "https://catchup.yuppcdn.net/amazonv2/36/preview/starjalsha/master/chunklist.m3u8",
            },
            {
              label: "AynaOTT",
              url: "https://tvsen3.aynaott.com/n64PH4YL/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "zee-24-ghanta",
          name: "Zee 24 Ghanta",
          shortName: "ZEE24",
          logo: "assets/logos/zee-24-ghanta.png",
          quality: "HD",
          streams: [
            {
              label: "CloudFront",
              url: "https://d2dsoyvkr33m05.cloudfront.net/index_1.m3u8",
            },
          ],
        },
        {
          id: "zee-action",
          name: "Zee Action",
          shortName: "ZA",
          logo: "assets/logos/zee-action.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/zee_action_abr/live/zee_action_720/chunks.m3u8",
            },
          ],
        },
        {
          id: "zee-bangla-hd",
          name: "Zee Bangla HD",
          shortName: "ZEEB",
          logo: "assets/logos/zee-bangla-hd.png",
          quality: "FHD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/zee_bangla_abr/live/zee_bangla_720/chunks.m3u8",
            },
            {
              label: "YuppTV",
              url: "https://catchup.yuppcdn.net/amazonv2/36/preview/zeebangla/master/chunklist.m3u8",
            },
            {
              label: "EPGMaker",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/536.ts",
            },
            /*
            {
              label: "BackupServ",
              url: "https://serverbackupchannel.xyz/jiotvchannel/app/live/625/Zee_Bangla/index.m3u8",
            },
            {
              label: "CloudFront",
              url: "https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeebangla/default/thenayeemparvez.m3u8",
            },
            */
          ],
        },
        {
          id: "zee-cinema",
          name: "Zee Cinema",
          shortName: "ZC",
          logo: "assets/logos/zee-cinema.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/zee_cinema_hd_abr/live/zee_cinema_hd_720/chunks.m3u8",
            },
          ],
        },
      ],
    },
    /*
    {
      name: "National Broadcasters",
      channels: [],
    },
    */
    {
      name: "Kids",
      channels: [
        {
          id: "cartoon-network",
          name: "Cartoon Network",
          shortName: "CN",
          logo: "assets/logos/cartoon-network.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/cn_sd_abr/live/cn_sd/chunks.m3u8",
            },
            {
              label: "mJunoon",
              url: "https://vodzong.mjunoon.tv:8087/streamtest/cartoon-network-87/live/87H/chunks.m3u8",
            },
          ],
        },
        {
          id: "doraemon",
          name: "Doraemon",
          shortName: "DORAEMON",
          logo: "assets/logos/doraemon.png",
          quality: "SD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209902/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "funny-junior",
          name: "Funny Junior",
          shortName: "FJ",
          logo: "https://cdnhost.akashbd.net/assets/uploads/channels_images/1770007686-69716217.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://nomawnoijl.gpcdn.net/akash/funnyjunior/playlist.m3u8",
            },
          ],
        },
        {
          id: "gopal-bhar",
          name: "Gopal Bhar",
          shortName: "GOPAL",
          logo: "assets/logos/gopal-bhar.png",
          quality: "SD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209611/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "motu-patlu",
          name: "Motu Patlu",
          shortName: "MOTU",
          logo: "assets/logos/motu-patlu.png",
          quality: "HD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209622/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "mr-bean",
          name: "Mr Bean",
          shortName: "BEAN",
          logo: "assets/logos/mr-bean.png",
          quality: "HD",
          streams: [
            {
              label: "Amagi",
              url: "https://amg00627-amg00627c29-rakuten-it-3989.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg00627-banijayfast-mrbeanitcc-rakutenit/cb573e196573618984c83c61cef04682ad7b3dcb0e6c886470af4a9765d9775884b7e1bfb415aa204cd717d80e0c695a4d258d13df7900d9de63b826612f4c2b859ab27ad9991309b3c8797368e62c4119e10f10d13b53309dec490cd065b429005ebe513f047fdcec0fac6b03c6d40d962c7c8eadd5373d7e5e599f093f5d916487c724993cf25ed3c50e72e77e1bb0de139d815fe3a2eb61ac32e5566ac050a0dabfa253dbd7bb5891be291c7b3d0675988b78d1be350d74ab1b58bf0b46621654eda2d3da472a8f544a53f6bda4d7df5122bceb74d21a529f089944857aec01ce58f5b119f2edd3db3381d07445d2c470809cace362f5344a50dbe883fc607598b9307046c26ce234411ebdf2d11d88cf14d9e36dd5f421256991ca05b794bc96f7f09512ca1a9c93afd82f5414325153c80debda4ade2ad677e79c43700c1d15fdcb15e28fcb5b366d57c9d10b855d4bcbbce1e6f30735df7861198207f4541f65c0386d068a0bf088396a863e4ac87511f2562098009b9c29e6accfea1631d78d91a29ecf326ebbb4e345aae9781f7f4d488eea87d4da82a6/36/1920x1080_6046040/index.m3u8",
            },
          ],
        },
        {
          id: "nicklodian-sonic",
          name: "Nicklodian SONIC",
          shortName: "SONIC",
          logo: " ",
          quality: "HD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209622/index.m3u8",
            },
          ],
        },
        {
          id: "oggy-and-cockroaches",
          name: "Oggy and Cockroaches",
          shortName: "OGGY",
          logo: "assets/logos/oggy-and-cockroaches.png",
          quality: "HD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-210728/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "pbs-kids",
          name: "PBS Kids",
          shortName: "PBSK",
          logo: "assets/logos/pbs-kids.png",
          quality: "fHD",
          streams: [
            {
              label: "StreamHost",
              url: "https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8",
            },
            {
              label: "StreamHost",
              url: "https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8?DVR",
            },
          ],
        },
        {
          id: "popkids",
          name: "Popkids",
          shortName: "POP",
          logo: "assets/logos/popkids.png",
          quality: "HD",
          streams: [
            {
              label: "Amagi",
              url: "https://amg01753-narrativeentert-popkids-lggb-xyy5k.amagi.tv/ts-eu-w1-n2/playlist/amg01753-narrativeentert-popkids-lggb/cb543d187b6c678b9ad43e6fd6ef43a2f9591fde1d6988693eb5518975d1073edce2a59caa08ff16388f1ede7f0a66413a3e951fda77118fd87eb141453c5728cfffe729a2c05616b7db083429b56a062a866a68ac39437ed0e21f48a238b6720a5aa82a66443d80b846ac7254db80148b61299bce8c37683f03409a5e5afba358b1ebe8084dd83aa4e51555972617e79f43c8821da6d2d50a9b5e8227a5429993f0dad143d380f359936790547338681dcbe0435ea837b9f7957330907d29094b1bb6e3dbc947328248544fb8d1ffff34af5d9ed265b66939ed54c30f9c66de22ea28b7f142a59abedd69482deb91083669f3b3e0c2d01d07904ab7e2e5d47879d9d1117b4cc6249801232a9ff0ce5bd59743d8e66dd5fa395d0bc197448994fdd6bce7c319ca57bfad9eaf344c4a6c1311c60cf2e80af51d9d29f880435b1f27228a955ac38adc24404147948f53d15356f9ec828ddb012cd9227c7eed73d24f0a7cc6573d2eb7cd986fb6942740333f17bae0653a8484fd686c6072f311/122/1920x1080_5903040/index.m3u8",
            },
          ],
        },
        {
          id: "rongeen-tv",
          name: "Rongeen TV",
          shortName: "RNGN",
          logo: "assets/logos/rongeen-tv.png",
          quality: "HD",
          streams: [
            {
              label: "LegitPro",
              url: "https://server.thelegitpro.in/rongeentv/rongeentv/tracks-v1a1/mono.m3u8",
            },
          ],
        },
        {
          id: "sony-yay",
          name: "Sony Yay",
          shortName: "YAY",
          logo: "assets/logos/sony-yay.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/sony_yay_abr/live/sony_yay_720/chunks.m3u8",
            },
          ],
        },
        {
          id: "srk-tv",
          name: "SRK TV",
          shortName: "SRK",
          logo: "assets/logos/srk-tv.png",
          quality: "HD",
          streams: [
            {
              label: "ncare",
              url: "https://srknowapp.ncare.live/srktvhlswodrm/srktv.stream/playlist.m3u8",
            },
          ],
        },
        {
          id: "tom-jerry",
          name: "Tom & Jerry",
          shortName: "T&J ",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Tom_and_Jerry_logo.svg/1280px-Tom_and_Jerry_logo.svg.png",
          quality: "HD",
          streams: [
            {
              label: "BozzTV",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-208314/tracks-v1a1/mono.ts.m3u8",
            },
            {
              label: "BozzTV-2",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-208314/playlist.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "Infotainment",
      channels: [
        {
          id: "animal-planet",
          name: "Animal Planet",
          shortName: "AP",
          logo: "assets/logos/animal-planet.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/animal_planet_sd_abr/live/animal_plnet_sd/chunks.m3u8",
            },
          ],
        },
        {
          id: "discovery-hd",
          name: "Discovery HD",
          shortName: "DSCH",
          logo: "assets/logos/discovery-hd.PNG",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/discovery_sd_abr/live/discovery_sd/chunks.m3u8",
            },
            {
              label: "Direct",
              url: "http://202.70.146.135:8000/play/a05z/index.m3u8",
            },
          ],
        },
        {
          id: "id-hd",
          name: "ID HD",
          shortName: "ID",
          logo: "assets/logos/id-hd.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/id_hd_abr/live/id_hd/chunks.m3u8",
            },
          ],
        },
        {
          id: "luxel-tv",
          name: "Luxell",
          shortName: "LUXE",
          logo: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1770378560772.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://nomawnoijl.gpcdn.net/akash/luxell/playlist.m3u8",
            },
          ],
        },
        {
          id: "motor-vision",
          name: "Motor Vision",
          shortName: "MOTO",
          logo: "https://motorvision.tv/wp-content/uploads/2023/09/MV_Logo_positive_light_background-2.png",
          quality: "HD",
          streams: [
            {
              label: "OtterVision",
              url: "https://mvg-mv-xumo.otteravision.com/mvg/mv/mv.m3u8",
            },
          ],
        },
        {
          id: "nat-geo-hd",
          name: "Nat Geo HD",
          shortName: "NATG",
          logo: "assets/logos/nat-geo-hd.svg",
          quality: "HD",
          streams: [
            {
              label: "Direct",
              url: "http://202.70.146.135:8000/play/a05o/index.m3u8",
            },
          ],
        },
        {
          id: "real-wild",
          name: "REAL WILD",
          shortName: "REAL",
          logo: " ",
          quality: "HD",
          streams: [
            {
              label: "Amagi",
              url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00426-littledotstudio-realwild-tcl/playlist.m3u8",
            },
          ],
        },
        {
          id: "red-bull-tv",
          name: "Red Bull TV",
          shortName: "RBTV",
          logo: "assets/logos/red-bull-tv.svg",
          quality: "HD",
          streams: [
            {
              label: "Akamai",
              url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8",
            },
          ],
        },
        {
          id: "tlc",
          name: "TLC",
          shortName: "TLC",
          logo: "assets/logos/tlc.png",
          quality: "HD",
          streams: [
            {
              label: "OTTPlus",
              url: "https://stream.ottplus.bd/live/tlc_sd_abr/live/tlc_sd/chunks.m3u8",
            },
          ],
        },
        {
          id: "travel-xp",
          name: "Travel XP",
          shortName: "TRXP",
          logo: "assets/logos/travel-xp.svg",
          quality: "HD",
          streams: [
            {
              label: "Rakuten",
              url: "https://travelxp-travelxp-1-eu.rakuten.wurl.tv/playlist.m3u8",
            },
            {
              label: "Samsung",
              url: "https://travelxp-travelxp-1-nz.samsung.wurl.tv/playlist.m3u8",
            },
          ],
        },
        {
          id: "wild-earth",
          name: "Wild Earth",
          shortName: "WE",
          logo: "assets/logos/wild-earth.png",
          quality: "HD",
          streams: [
            {
              label: "Amagi",
              url: "https://wildearth-plex.amagi.tv/masterR720P.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "Religious",
      channels: [
        {
          id: "al-quran-tv",
          name: "Al Quran Al Kareem TV",
          shortName: "MAKKA",
          logo: "assets/logos/al-quran-tv.png",
          quality: "HD",
          streams: [
            {
              label: "gpcdn",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1713/output/index.m3u8",
            },
            {
              label: "SaudiLive",
              url: "http://m.live.net.sa:1935/live/quran/playlist.m3u8",
            },
            {
              label: "Akamai",
              url: "https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8",
            },
          ],
        },
        {
          id: "al-sunnah-tv",
          name: "Al Sunnah Al Nabawiyah TV",
          shortName: "MADINA",
          logo: "assets/logos/al-sunnah-tv.png",
          quality: "HD",
          streams: [
            {
              label: "SaudiLive",
              url: "http://m.live.net.sa:1935/live/sunnah/playlist.m3u8",
            },
            {
              label: "Akamai",
              url: "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8",
            },
          ],
        },
        {
          id: "ilm-tv",
          name: "Ilm TV",
          shortName: "ILM",
          logo: "https://yt3.googleusercontent.com/cCETTs55ld8DoOwZ2i4nJI-Z25DOvLIUrdkejbSuvn7JRoWiLCkEPOteoz1ZeXWyAzZzm4OG6g=s900-c-k-c0x00ffffff-no-rj",
          quality: "HD",
          streams: [
            {
              label: "tplay",
              url: "https://tplay.live/originals/ilm-tv/index.m3u8",
            },
          ],
        },
        {
          id: "madani-channel",
          name: "Madani Channel Bangla",
          shortName: "MCB",
          logo: "assets/logos/madani-channel.png",
          quality: "FHD",
          streams: [
            {
              label: "MadaniTV",
              url: "https://streaming.madanichannel.tv/static/streaming-playlists/hls/d3e49b76-ac06-4689-a641-9200445b647f/master.m3u8",
            },
          ],
        },
        {
          id: "peace-tv-bangla",
          name: "Peace TV Bangla",
          shortName: "PEACE",
          logo: "assets/logos/peace-tv-bangla.png",
          quality: "FHD",
          streams: [
            {
              label: "erbvr",
              url: "https://dzkyvlfyge.erbvr.com/PeaceTvBangla/index.m3u8",
            },
          ],
        },
        {
          id: "peace-tv-english",
          name: "Peace TV English",
          shortName: "PTVE",
          logo: "assets/logos/peace-tv-english.png",
          quality: "FHD",
          streams: [
            {
              label: "erbvr",
              url: "https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8",
            },
          ],
        },
        {
          id: "quran-tv",
          name: "Quran TV",
          shortName: "Q24",
          logo: "https://qurantv.in/wp-content/uploads/2023/11/logo-quran.png",
          quality: "HD",
          streams: [
            {
              label: "Sharjah Quran",
              url: "https://live.kwikmotion.com/sharjahtvquranlive/shqurantv.smil/playlist.m3u8",
            },
            {
              label: "SMC Radio",
              url: "https://live.kwikmotion.com/smcquranlive/quranradiolive/playlist.m3u8",
            },
          ],
        },
      ],
    },
  ],
};