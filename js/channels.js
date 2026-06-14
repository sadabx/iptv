/* ==========================================
   channels.js — IPTV Channel Mapping Database
   ========================================== */

const CHANNELS_DATA = {
  categories: [
    {
      name: "Sports",
      channels: [
        {
          id: "fifa-wc-2026",
          name: "FIFA 26 Live",
          shortName: "FIFA",
          logo: "assets/logos/fifa-wc-2026.svg",
          quality: "FHD",
          streams: [
            {
              label: "United Sports 2",
              url: "http://66.102.126.10:8000/play/a022/index.m3u8",
            },
            {
              label: "FIFA+",
              url: "https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8",
            },
            {
              label: "Caze TV (BR)",
              url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/1080p-vtt/index.m3u8",
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
              label: "Auto",
              url: "https://hakunamatata5.org:8088/hls/sky-f1.m3u8",
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
              label: "Auto",
              url: "http://151.80.18.177:86/Eurosport_HD/index.m3u8",
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
              label: "Auto",
              url: "https://tvsen7.aynaott.com/tsportsfhd/index.m3u8",
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
              label: "Auto",
              url: "http://202.70.146.135:8000/play/a01e/index.m3u8",
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
              label: "Token Link",
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
              label: "Auto",
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
              label: "Cluster Link",
              url: "http://66.102.126.10:8000/play/a010/index.m3u8",
            },
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
              label: "Auto",
              url: "http://sewv654wfcsdwfi87fwvgbngh.siauliairsavlt.pw/iptv/VCQ4ADX96VH4G8PY7URBWRQU/19146/index.m3u8",
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
              label: "link.ts",
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
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8",
            },
          ],
        },
        {
          id: "al-jazeera",
          name: "Al Jazeera English",
          shortName: "AJE",
          logo: "assets/logos/al-jazeera.png",
          quality: "HD",
          streams: [
            {
              label: "Official Web HLS",
              url: "https://live-hls-web-aje.getaj.net/AJE/01.m3u8",
            },
          ],
        },
        {
          id: "cna",
          name: "Channel NewsAsia",
          shortName: "CNA",
          logo: "assets/logos/cna.svg",
          quality: "HD",
          streams: [
            {
              label: "Auto",
              url: "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_5.m3u8",
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
              label: "1080p",
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
              label: "1080p-2",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8",
            },
            {
              label: "1080p",
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
              label: "1080p",
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
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-DeshTV/index.m3u8",
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/deshtv/index.m3u8",
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
              label: "1080p-2",
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
              label: "Youtube live",
              url: "https://www.youtube.com/live/ShCdQy8l0SU?si=zpXsX8Omi19hTt5L",
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
              label: "Auto",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8",
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
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8",
            },
            {
              label: "Youtube live",
              url: "https://www.youtube.com/live/dpRmnIcjKPs?si=V150TEgJMNvokl3B",
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
              label: "Auto",
              url: "https://app.ncare.live/live-orgin/jagonews24.stream/playlist.m3u8",
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
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/index.m3u8",
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
            { label: "YouTube Live", url: "https://youtu.be/ITx_k7uNFP4" },
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
              label: "Auto",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "General & Entertainment",
      channels: [
        {
          id: "ananda-tv",
          name: "Ananda TV",
          shortName: "AND",
          logo: "assets/logos/ananda-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "Auto",
              url: "https://bozztv.com/rongo/rongo-AnandaTV/index.m3u8",
            },
          ],
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
              label: "Auto",
              url: "https://tvsen5.aynaott.com/atnbangla/index.m3u8",
            },
          ],
        },
        {
          id: "bangla-tv",
          name: "Bangla TV",
          shortName: "BNG",
          logo: "assets/logos/bangla-tv.png",
          quality: "HD",
          streams: [
            {
              label: "Auto",
              url: "https://tvsen6.aynaott.com/banglatv/index.m3u8",
            },
          ],
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
              label: "1080p",
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
              label: "Auto",
              url: "https://boishakhi.sonarbanglatv.com/boishakhi/boishakhitv/index.m3u8",
            },
            {
              label: "720p",
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
              label: "1080p",
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
              label: "1080p",
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
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8",
            },
            {
              label: "Alt",
              url: "https://byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8",
            },
            {
              label: "Alt-2",
              url: "https://byphdgllyk.gpcdn.net/hls/deeptotv/0_1/index.m3u8",
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
            { label: "480p", url: "https://ekusheyserver.com/etvlivesn.m3u8" },
            { label: "720p", url: "https://tvsen6.aynaott.com/etv/index.m3u8" },
          ],
        },
        {
          id: "gazi-tv",
          name: "Gazi TV (GTV)",
          shortName: "GTV",
          logo: "assets/logos/gazi-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p",
              url: "http://tvn1.chowdhury-shaheb.com/gazitv/index.m3u8",
            },
            {
              label: "720p (AynaOTT)",
              url: "https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8",
            },
            {
              label: "720p (Sonyplex)",
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
              label: "720p",
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
              label: "1080p",
              url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/playlist.m3u8",
            },
            {
              label: "1080p-2",
              url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/chunks.m3u8",
            },
          ],
        },
        {
          id: "maasranga-tv",
          name: "Maasranga TV",
          shortName: "MSTV",
          logo: "assets/logos/maasranga-tv.png",
          quality: "FHD",
          streams: [
            {
              label: "1080p Main",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8",
            },
            {
              label: "Sonyplex Secure",
              url: "https://ott.sonyplex.com:444/play/EDI0B4ME7MUUyw-g59yLM0EYZFpbYzWflwzOUv40VOY/m3u8",
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
              label: "1080p",
              url: "https://bozztv.com/rongo/rongo-MohonaTV/index.m3u8",
            },
            {
              label: "720p",
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
              label: "Auto",
              url: "http://alvetv.com/moviebanglatv/8080/index.m3u8",
            },
          ],
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
              url: "https://tvsen6.aynaott.com/mytv/index.m3u8",
            },
          ],
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
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8",
            },
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/xV4jEKf3D9zc/index.m3u8",
            },
          ],
        },
        {
          id: "rtv",
          name: "RTV",
          shortName: "RTV",
          logo: "assets/logos/rtv.png",
          quality: "FHD",
          streams: [
            { label: "1080p", url: "http://116.204.149.16/rtvhd/index.m3u8" },
            {
              label: "720p",
              url: "https://bozztv.com/rongo/rongo-RTV/index.m3u8",
            },
          ],
        },
        {
          id: "sa-tv",
          name: "SA TV",
          shortName: "SATV",
          logo: "assets/logos/sa-tv.png",
          quality: "HD",
          streams: [
            {
              label: "1080p",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1720/output/index.m3u8",
            },
            {
              label: "720p",
              url: "https://tvsen6.aynaott.com/satv/index.m3u8",
            },
          ],
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
              url: "https://vokta.raytahost.com/live/voktatv/index.m3u8",
            },
          ],
        },
      ],
    },

    // INDIAN
    {
      name: "Indian",
      channels: [
        {
          id: "zee-bangla-hd",
          name: "Zee Bangla HD",
          shortName: "ZEEB",
          logo: "assets/logos/zee-bangla-hd.png",
          quality: "FHD",
          streams: [
            {
              label: "JioTV Backup",
              url: "https://serverbackupchannel.xyz/jiotvchannel/app/live/625/Zee_Bangla/index.m3u8",
            },
            {
              label: "Cloudfront Hub",
              url: "https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeebangla/default/thenayeemparvez.m3u8",
            },
            {
              label: "Token Link",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/536.ts",
            },
            {
              label: "Catchup Preview",
              url: "https://catchup.yuppcdn.net/amazonv2/36/preview/zeebangla/master/chunklist.m3u8",
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
              label: "YuppCatchup",
              url: "https://catchup.yuppcdn.net/amazonv2/36/preview/starjalsha/master/chunklist.m3u8",
            },
            {
              label: "Corpus Link",
              url: "http://45.127.56.3:9698/live/Corpus-POL/SRV4/3/STAR-JALSHA/video.m3u8",
            },
            {
              label: "Trex Server",
              url: "http://tv.trexiptv.com/play/live.php?mac=00:1a:79:4b:66:ae&stream=155770&extension=ts&play_token=otM0DQF4Ff",
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
              label: "JioCinema CDN",
              url: "https://prod-ent-live-gm.jiocinema.com/bpk-tv/Colors_Bangla_HD_voot_MOB/Fallback/Colors_Bangla_HD_voot_MOB-audio_98835_ben=98800-video=765200.m3u8",
            },
            {
              label: "Token Link",
              url: "http://main.epgmaker.com/live/y49sz6KMQs/6115263489/532.ts",
            },
          ],
        },
        {
          id: "colors-cineplex-hd",
          name: "Colors Cineplex HD",
          shortName: "CINEPLEX",
          logo: "assets/logos/colors-cineplex-hd.svg",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "http://66.102.126.10:8000/play/a076/index.m3u8",
            },
          ],
        },
        {
          id: "sony-aath",
          name: "Sony AATH",
          shortName: "AATH",
          logo: "assets/logos/sony-aath.png",
          quality: "HD",
          streams: [
            {
              label: "Corpus POL Server",
              url: "http://45.127.56.3:9698/live/Corpus-POL/SRV4/1/SONY-AATH/video.m3u8",
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
              label: "Alternative CDN",
              url: "https://d2dsoyvkr33m05.cloudfront.net/index_1.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "National Broadcasters",
      channels: [
        /*
        {
          id: "btv-national",
          name: "BTV National",
          shortName: "BTV",
          logo: "assets/logos/btv-world.png",
          quality: "HD",
          streams: [
            {
              label: "Auto",
              url: "",
            },
          ],
        }, */
        {
          id: "sangsad-tv",
          name: "Sangsad TV",
          shortName: "SANG",
          logo: "assets/logos/sangsad-tv.png",
          quality: "HD",
          streams: [
            {
              label: "Auto",
              url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "Kids & Family",
      channels: [
        {
          id: "doraemon",
          name: "Doraemon",
          shortName: "DORAEMON",
          logo: "assets/logos/doraemon.png",
          quality: "SD",
          streams: [
            {
              label: "Auto",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209902/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "duronto-tv",
          name: "Duronto TV",
          shortName: "DRNT",
          logo: "assets/logos/duronto-tv.png",
          quality: "HD",
          streams: [
            {
              label: "720p",
              url: "https://tvsen5.aynaott.com/durontotv/index.m3u8",
            },
            {
              label: "720p-2",
              url: "https://tvsen6.aynaott.com/durontotv-live/index.m3u8",
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
              label: "Auto",
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
              label: "Auto",
              url: "https://live20.bozztv.com/giatvplayout7/giatv-209622/tracks-v1a1/mono.ts.m3u8",
            },
          ],
        },
        {
          id: "pbs-kids-usa",
          name: "PBS Kids",
          shortName: "PBSK",
          logo: "assets/logos/pbs-kids-usa.png",
          quality: "fHD",
          streams: [
            {
              label: "1080p",
              url: "https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8",
            },
            {
              label: "480p",
              url: "https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8?DVR",
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
              label: "Auto",
              url: "https://server.thelegitpro.in/rongeentv/rongeentv/tracks-v1a1/mono.m3u8",
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
              label: "Auto",
              url: "https://srknowapp.ncare.live/srktvhlswodrm/srktv.stream/playlist.m3u8",
            },
          ],
        },
      ],
    },
    {
      name: "Infotainment",
      channels: [
        {
          id: "discovery-hd",
          name: "Discovery HD",
          shortName: "DSCH",
          logo: "assets/logos/discovery-hd.PNG",
          quality: "HD",
          streams: [
            {
              label: "Auto",
              url: "http://202.70.146.135:8000/play/a05z/index.m3u8",
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
              label: "Auto",
              url: "http://202.70.146.135:8000/play/a05o/index.m3u8",
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
              label: "Auto",
              url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8",
            },
          ],
        },
        {
          id: "travel-xp-uk",
          name: "Travel XP UK",
          shortName: "TRXP",
          logo: "assets/logos/travel-xp-uk.svg",
          quality: "HD",
          streams: [
            {
              label: "Auto",
              url: "https://travelxp-travelxp-1-eu.rakuten.wurl.tv/playlist.m3u8",
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
              label: "720p",
              url: "http://m.live.net.sa:1935/live/quran/playlist.m3u8",
            },
            {
              label: "360p",
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
              label: "720p",
              url: "http://m.live.net.sa:1935/live/sunnah/playlist.m3u8",
            },
            {
              label: "360p",
              url: "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8",
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
              label: "1080p",
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
              label: "1080p",
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
              label: "1080p",
              url: "https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8",
            },
          ],
        },
      ],
    },
  ],
};
