# TRIONINE <span style="color: #35d6a4; font-size: 1.6rem;">TV</span>
IPTV Website optimised for android tv, smart tv, mobile and web browser 
## Project Structure

```text
.
├── index.html              # Main IPTV app shell
├── 404.html                # GitHub Pages fallback
├── css/                    # App stylesheets by responsibility
│   ├── app.css             # Design tokens, reset, app shell, nav, search, toasts
│   ├── theme.css           # TRIONINE visual theme overrides and home carousel styling
│   ├── player.css          # Video player and controls
│   ├── guide.css           # Channel guide/sidebar, categories, channel logos
│   ├── catalog.css         # Channel grids, cards, watch-more lists, offline states
│   ├── footer.css          # Site footer styling
│   ├── chat.css            # Live chat panel
│   ├── mobile.css          # Mobile layout, tab bar, player, and browse sheet
│   └── live-carousel.css   # Popular match carousel
├── js/                     # Browser JavaScript by responsibility
│   ├── channel-catalog.js  # Channel catalogue data
│   ├── stream-player.js    # HLS/MPEG-TS/native player logic
│   ├── embed-providers.js  # YouTube and streamed.pk embed handling
│   ├── ui-renderer.js      # DOM rendering, search, guide, and status UI
│   ├── live-chat.js        # Firebase live chat behavior
│   ├── bootstrap.js        # App bootstrap, event wiring, routing
│   └── live-carousel.js    # Live match carousel behavior
├── data/
│   └── channels.json       # Stable JSON feed for the TNTV Android app
├── assets/                 # Icons and channel logos
├── cf-workers/             # Cloudflare Worker proxy scripts
└── link-auditor/           # Stream/link audit utility
```

---

## Website Integration

You can easily integrate this player into your own website:

* **Asset Integration**: Copy the source files (`index.html`, `css/`, `js/`, and `assets/`) directly into your website project directory.
* **Iframe Embedding**: Embed the player as a responsive frame anywhere on your pages:
  ```html
  <iframe src="index.html" width="100%" height="600px" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
  ```

> [!WARNING]
> **Mixed Content & HTTPS Restrictions**: Stream URLs using `http://` will fail to load if your website is hosted on `https://` due to browser mixed-content blocking. If you deploy this player on an HTTPS site, ensure your stream URLs also use `https://`. or use cloudflare worker or any other proxy for ssl termination. Or run a local server.

---

## 📡 Supported Links & Formats

* **Streaming Formats**: HLS (`.m3u8`), MPEG-TS (`.ts`), and YouTube live streams or video links.
* **Subtitles**: Native WebVTT (`.vtt`) files and in-band CEA-608 closed caption data streams.

---

## 📺 Channel Stream Links

Current active catalog: 94 channels across 9 categories.

The website runtime uses `js/channel-catalog.js` for speed and easy commenting while editing. `data/channels.json` is a published mirror feed for the TNTV Android app, intended to be served from `https://iptv.trionine.com/data/channels.json` so the app is not tied to a GitHub repository name or visibility.

| Channel Name | Stream URL |
| --- | --- |
| BeinSports-1 | `http://ua.online24.pm/play/1101/350B326FB34F4B8/video.m3u8` <br> `https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8` <br> `https://edge22.776740.ir.cdn.ir/hls2/sport.m3u8` |
| Eurosport HD | `http://151.80.18.177:86/Eurosport_HD/index.m3u8` |
| F1 TV | `https://hakunamatata5.org:8088/hls/sky-f1.m3u8` |
| FIFA World Cup 2026 | `https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8` <br> `https://fawatv.online/live/F2E62CEFFF6C6F88C237BD9DF4957C35/667.m3u8` <br> `https://edge22.776740.ir.cdn.ir/hls2/sport.m3u8` <br> `https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8` |
| Fox Sports 501 HD | `http://sewv654wfcsdwfi87fwvgbngh.siauliairsavlt.pw/iptv/VCQ4ADX96VH4G8PY7URBWRQU/19146/index.m3u8` |
| Sony Sports 5 | `http://66.102.126.10:8000/play/a010/index.m3u8` |
| Sport TV | `https://1nyaler.streamhostingcdn.top/stream/33/index.m3u8` |
| Star Sports 1 | `http://202.70.146.135:8000/play/a01e/index.m3u8` <br> `http://41.205.93.154/STARSPORTS1/index.m3u8` |
| T Sports | `http://rgkkw.live/live/1Aoen7elp5/IgMJ60tmAa/130714.ts` <br> `https://tvsen7.aynaott.com/tsportsfhd/index.m3u8` |
| Thunder Er | `https://nomawnoijl.gpcdn.net/akash/thunder/playlist.m3u8` |
| Willow Sports | `http://main.epgmaker.com/live/y49sz6KMQs/6115263489/517.ts` |
| ATN News | `https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8` |
| Channel 1 | `https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8` |
| Channel 24 | `https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8` <br> `https://bozztv.com/rongo/rongo-Channel24HD/index.m3u8` |
| DBC News | `https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8` |
| Desh TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1724/output/index.m3u8` <br> `https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/deshtv.stream/tracks-v1/mono.m3u8` |
| Ekattor TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8` |
| Ekhon TV | `https://www.youtube.com/live/PRvnQNOaTFg?si=eso9StsMEEnoIZ2K` |
| Independent TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8` |
| Jago News 24 | `https://app.ncare.live/live-orgin/jagonews24.stream/playlist.m3u8` |
| Jamuna TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8` <br> `https://www.youtube.com/live/0mWPK8U8jo0?si=PvmDqAuISJsC3Oxw` |
| News 24 | `https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/index.m3u8` |
| Sangsad TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8` |
| Somoy TV | `https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8` <br> `https://youtu.be/ITx_k7uNFP4` |
| Star News | `https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8` |
| Al Jazeera English | `https://owrcovcrpy.gpcdn.net/bpk-tv/1721/output/index.m3u8` |
| CNA | `https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_5.m3u8` |
| CNN | `https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8` |
| Press TV Iran | `https://live.presstv.ir/hls/presstv_5_482/index.m3u8` |
| Ananda TV | `https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/anandatv.stream/tracks-v1a1/mono.m3u8` |
| ATN Music | `https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI/atnmusic.stream/playlist.m3u8` |
| Bangla Vision | `https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/index.m3u8` |
| Bijoy TV | `http://main.epgmaker.com/live/y49sz6KMQs/6115263489/581.ts` |
| Boishakhi TV | `https://boishakhi.sonarbanglatv.com/boishakhi/boishakhitv/index.m3u8` <br> `https://tvsen6.aynaott.com/boishakhitv/index.m3u8` |
| Channel 9 | `https://owrcovcrpy.gpcdn.net/bpk-tv/1729/output/index.m3u8` |
| Channel I | `https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8` |
| Deepto TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8` <br> `https://byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8` |
| Ekushey TV | `https://ekusheyserver.com/etvlivesn.m3u8` <br> `https://tvsen6.aynaott.com/etv/index.m3u8` |
| Maasranga TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/index.m3u8` |
| Mohona TV | `https://bozztv.com/rongo/rongo-MohonaTV/index.m3u8` <br> `https://tvsen6.aynaott.com/mohonatv/index.m3u8` |
| Movie Bangla | `http://alvetv.com/moviebanglatv/8080/index.m3u8` |
| NTV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8` <br> `https://tvsen5.aynaott.com/xV4jEKf3D9zc/index.m3u8` |
| SA TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1720/output/index.m3u8` <br> `https://tvsen6.aynaott.com/satv/index.m3u8` |
| Crimes | `https://nomawnoijl.gpcdn.net/akash/crimes/playlist.m3u8` |
| Moviebox | `https://cdn1.skygo.mn/live/disk1/Moviebox/HLS-FTA/Moviebox.m3u8` |
| Superrix HD | `https://nomawnoijl.gpcdn.net/akash/superrix/playlist.m3u8` |
| Uniques HD | `https://nomawnoijl.gpcdn.net/akash/uniques/playlist.m3u8` |
| Aakash Aath | `https://live.thebosstv.com:30443/dwlive/AAKAASH-AATH/chunks.m3u8` <br> `https://cdn-4.pishow.tv/live/969/master.m3u8` |
| B4U Kadak | `https://cdn-2.pishow.tv/live/227/master.m3u8` |
| Colors Bangla | `http://main.epgmaker.com/live/y49sz6KMQs/6115263489/532.ts` |
| Colors Cineplex | `http://66.102.126.10:8000/play/a076/index.m3u8` |
| Hindi Movies | `https://live20.bozztv.com/giatvplayout7/giatv-209612/tracks-v1a1/mono.ts.m3u8` |
| Joo Music | `https://livecdn.live247stream.com/joomusic/tv/playlist.m3u8` |
| Sheemaroo Bollywood | `https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg00864-shemarooenterta-shemabollywood-ono/playlist.m3u8` |
| Sony Max | `https://stream.ottplus.bd/live/sony_max_sd_abr/live/sony_max_sd_720/chunks.m3u8` |
| Sony SAB | `https://stream.ottplus.bd/live/sub_hd_abr/live/sony_sub_hd_720/chunks.m3u8` |
| Star Bharat | `http://66.102.126.10:8000/play/a022/index.m3u8` |
| Star Jalsha HD | `https://catchup.yuppcdn.net/amazonv2/36/preview/starjalsha/master/chunklist.m3u8` <br> `https://tvsen3.aynaott.com/n64PH4YL/tracks-v1a1/mono.ts.m3u8` |
| Zee 24 Ghanta | `https://d2dsoyvkr33m05.cloudfront.net/index_1.m3u8` |
| Zee Action | `https://stream.ottplus.bd/live/zee_action_abr/live/zee_action_720/chunks.m3u8` |
| Zee Bangla HD | `https://stream.ottplus.bd/live/zee_bangla_abr/live/zee_bangla_720/chunks.m3u8` <br> `https://catchup.yuppcdn.net/amazonv2/36/preview/zeebangla/master/chunklist.m3u8` <br> `http://main.epgmaker.com/live/y49sz6KMQs/6115263489/536.ts` |
| Zee Cinema | `https://stream.ottplus.bd/live/zee_cinema_hd_abr/live/zee_cinema_hd_720/chunks.m3u8` |
| Cartoon Network | `https://stream.ottplus.bd/live/cn_sd_abr/live/cn_sd/chunks.m3u8` <br> `https://vodzong.mjunoon.tv:8087/streamtest/cartoon-network-87/live/87H/chunks.m3u8` |
| Doraemon | `https://live20.bozztv.com/giatvplayout7/giatv-209902/tracks-v1a1/mono.ts.m3u8` |
| Funny Junior | `https://nomawnoijl.gpcdn.net/akash/funnyjunior/playlist.m3u8` |
| Gopal Bhar | `https://live20.bozztv.com/giatvplayout7/giatv-209611/tracks-v1a1/mono.ts.m3u8` |
| Motu Patlu | `https://live20.bozztv.com/giatvplayout7/giatv-209622/tracks-v1a1/mono.ts.m3u8` |
| Mr Bean | `https://amg00627-amg00627c29-rakuten-it-3989.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg00627-banijayfast-mrbeanitcc-rakutenit/cb573e196573618984c83c61cef04682ad7b3dcb0e6c886470af4a9765d9775884b7e1bfb415aa204cd717d80e0c695a4d258d13df7900d9de63b826612f4c2b859ab27ad9991309b3c8797368e62c4119e10f10d13b53309dec490cd065b429005ebe513f047fdcec0fac6b03c6d40d962c7c8eadd5373d7e5e599f093f5d916487c724993cf25ed3c50e72e77e1bb0de139d815fe3a2eb61ac32e5566ac050a0dabfa253dbd7bb5891be291c7b3d0675988b78d1be350d74ab1b58bf0b46621654eda2d3da472a8f544a53f6bda4d7df5122bceb74d21a529f089944857aec01ce58f5b119f2edd3db3381d07445d2c470809cace362f5344a50dbe883fc607598b9307046c26ce234411ebdf2d11d88cf14d9e36dd5f421256991ca05b794bc96f7f09512ca1a9c93afd82f5414325153c80debda4ade2ad677e79c43700c1d15fdcb15e28fcb5b366d57c9d10b855d4bcbbce1e6f30735df7861198207f4541f65c0386d068a0bf088396a863e4ac87511f2562098009b9c29e6accfea1631d78d91a29ecf326ebbb4e345aae9781f7f4d488eea87d4da82a6/36/1920x1080_6046040/index.m3u8` |
| Nicklodian SONIC | `https://live20.bozztv.com/giatvplayout7/giatv-209622/index.m3u8` |
| Oggy and Cockroaches | `https://live20.bozztv.com/giatvplayout7/giatv-210728/tracks-v1a1/mono.ts.m3u8` |
| PBS Kids | `https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8` <br> `https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8?DVR` |
| Popkids | `https://amg01753-narrativeentert-popkids-lggb-xyy5k.amagi.tv/ts-eu-w1-n2/playlist/amg01753-narrativeentert-popkids-lggb/cb543d187b6c678b9ad43e6fd6ef43a2f9591fde1d6988693eb5518975d1073edce2a59caa08ff16388f1ede7f0a66413a3e951fda77118fd87eb141453c5728cfffe729a2c05616b7db083429b56a062a866a68ac39437ed0e21f48a238b6720a5aa82a66443d80b846ac7254db80148b61299bce8c37683f03409a5e5afba358b1ebe8084dd83aa4e51555972617e79f43c8821da6d2d50a9b5e8227a5429993f0dad143d380f359936790547338681dcbe0435ea837b9f7957330907d29094b1bb6e3dbc947328248544fb8d1ffff34af5d9ed265b66939ed54c30f9c66de22ea28b7f142a59abedd69482deb91083669f3b3e0c2d01d07904ab7e2e5d47879d9d1117b4cc6249801232a9ff0ce5bd59743d8e66dd5fa395d0bc197448994fdd6bce7c319ca57bfad9eaf344c4a6c1311c60cf2e80af51d9d29f880435b1f27228a955ac38adc24404147948f53d15356f9ec828ddb012cd9227c7eed73d24f0a7cc6573d2eb7cd986fb6942740333f17bae0653a8484fd686c6072f311/122/1920x1080_5903040/index.m3u8` |
| Rongeen TV | `https://server.thelegitpro.in/rongeentv/rongeentv/tracks-v1a1/mono.m3u8` |
| Sony Yay | `https://stream.ottplus.bd/live/sony_yay_abr/live/sony_yay_720/chunks.m3u8` |
| SRK TV | `https://srknowapp.ncare.live/srktvhlswodrm/srktv.stream/playlist.m3u8` |
| Tom & Jerry | `https://live20.bozztv.com/giatvplayout7/giatv-208314/tracks-v1a1/mono.ts.m3u8` <br> `https://live20.bozztv.com/giatvplayout7/giatv-208314/playlist.m3u8` |
| Animal Planet | `https://stream.ottplus.bd/live/animal_planet_sd_abr/live/animal_plnet_sd/chunks.m3u8` |
| Discovery HD | `https://stream.ottplus.bd/live/discovery_sd_abr/live/discovery_sd/chunks.m3u8` <br> `http://202.70.146.135:8000/play/a05z/index.m3u8` |
| ID HD | `https://stream.ottplus.bd/live/id_hd_abr/live/id_hd/chunks.m3u8` |
| Luxell | `https://nomawnoijl.gpcdn.net/akash/luxell/playlist.m3u8` |
| Motor Vision | `https://mvg-mv-xumo.otteravision.com/mvg/mv/mv.m3u8` |
| Nat Geo HD | `http://202.70.146.135:8000/play/a05o/index.m3u8` |
| REAL WILD | `https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00426-littledotstudio-realwild-tcl/playlist.m3u8` |
| Red Bull TV | `https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8` |
| TLC | `https://stream.ottplus.bd/live/tlc_sd_abr/live/tlc_sd/chunks.m3u8` |
| Travel XP | `https://travelxp-travelxp-1-eu.rakuten.wurl.tv/playlist.m3u8` <br> `https://travelxp-travelxp-1-nz.samsung.wurl.tv/playlist.m3u8` |
| Wild Earth | `https://wildearth-plex.amagi.tv/masterR720P.m3u8` |
| Al Quran Al Kareem TV | `https://owrcovcrpy.gpcdn.net/bpk-tv/1713/output/index.m3u8` <br> `http://m.live.net.sa:1935/live/quran/playlist.m3u8` <br> `https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8` |
| Al Sunnah Al Nabawiyah TV | `http://m.live.net.sa:1935/live/sunnah/playlist.m3u8` <br> `https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8` |
| Ilm TV | `https://tplay.live/originals/ilm-tv/index.m3u8` |
| Madani Channel Bangla | `https://streaming.madanichannel.tv/static/streaming-playlists/hls/d3e49b76-ac06-4689-a641-9200445b647f/master.m3u8` |
| Peace TV Bangla | `https://dzkyvlfyge.erbvr.com/PeaceTvBangla/index.m3u8` |
| Peace TV English | `https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8` |
| Quran TV | `https://live.kwikmotion.com/sharjahtvquranlive/shqurantv.smil/playlist.m3u8` <br> `https://live.kwikmotion.com/smcquranlive/quranradiolive/playlist.m3u8` |

## Removed Channels

ATN Bangla, Asian TV, BTV National, BTV World, Bangla TV, Colors Bangla HD, Duronto TV, Fox 5, Gazi TV, Global TV, Green TV, My TV, RTV, Sky Sports Cricket, Sony AATH, Sony Sports 2 HD, TNT Sports, Vokta TV
