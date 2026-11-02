# TRIONINE <span style="color: #6181ff;">TV</span> — Open-Source Web & Smart TV IPTV Player

[![Live Demo](https://img.shields.io/badge/demo-iptv.trionine.com-6181ff?style=for-the-badge&logo=google-chrome&logoColor=white)](https://iptv.trionine.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-35d6a4?style=for-the-badge)](LICENSE)
[![Zero Backend](https://img.shields.io/badge/architecture-100%25%20client--side-orange?style=for-the-badge)](https://github.com/sadabx/iptv)
[![Smart TV Ready](https://img.shields.io/badge/Smart%20TV-Remote%20%26%20D--Pad-purple?style=for-the-badge)](https://github.com/sadabx/iptv)

> A modern, lightweight, zero-dependency IPTV player and web application optimized for Smart TVs, Android TV, set-top boxes, mobile browsers, and desktop.

---

## 🌟 Highlights & Features

- 📺 **Smart TV & Remote Control Ready**: Full directional keypad (D-Pad), Arrow keys, Enter, and Back navigation powered by `tv-input-manager.js`. Runs smoothly inside Android TV and Fire TV web browsers.
- 📂 **Bring Your Own M3U (BYOM)**:
  - **URL Import**: Paste any `.m3u` or `.m3u8` playlist link from your IPTV subscription, Pastebin, or GitHub.
  - **Local File Upload**: Drag-and-drop or upload `.m3u` files directly from your device.
  - **1-Click Open-Source Presets**: Instant access to community-verified 24/7 channels from [iptv-org](https://github.com/iptv-org/iptv) across News, Sports, Movies, Music, Science, and Kids.
  - **Persistent Storage**: Playlists and favorites are automatically cached in browser `localStorage`.
- ⚡ **Zero-Backend & 100% Static**: Pure Vanilla JavaScript, HTML5, and CSS3. Zero framework bloat (no React, no Next.js build steps, no Node backend required).
- 🎬 **Multi-Format Player**: Built on [Hls.js](https://github.com/video-dev/hls.js/) and [mpegts.js](https://github.com/xqq/mpegts.js/) for smooth HLS (`.m3u8`), MPEG-TS (`.ts`), and embedded YouTube live playback.
- 🛡️ **Cloudflare Worker SSL & CORS Proxy**: Includes an edge reverse proxy script in `cf-workers/http-proxy.js` to resolve browser mixed-content blocks (streaming `http://` channels on `https://` websites).
- 💬 **Live Chat Panel**: Optional real-time chat box powered by Firebase Realtime Database.

---

## 🚀 Quickstart & Local Setup

Because TRIONINE TV is completely static, you can run it with any local static web server or open `index.html` directly:

### Option 1: Using Node / npx
```bash
# Clone the repository
git clone https://github.com/sadabx/iptv.git
cd iptv

# Start a local static server
npx serve .
# Or using python:
# python3 -m http.server 8080
```
Open `http://localhost:3000` (or `http://localhost:8080`) in your browser.

### Option 2: Deploy to GitHub Pages (1-Click)
1. Fork or clone this repository to your GitHub account.
2. In your repo settings, go to **Pages** → Source: **Deploy from a branch** → Branch: **`main`** / `/ (root)`.
3. Your IPTV player is live instantly with free HTTPS hosting!

---

## 🎮 Remote & Keyboard Controls (Smart TV)

TRIONINE TV automatically detects TV browsers and enables spatial focus navigation:

| Key | Action |
| --- | --- |
| `Arrow Keys` (Up / Down / Left / Right) | Move selection across channels, carousels, and menus |
| `Enter` / `OK` | Play selected channel or toggle control |
| `Escape` / `Back` | Close modals, exit channel guide, or return to Home |
| `Space` | Play / Pause current stream |
| `F` | Toggle Fullscreen mode |
| `M` | Mute / Unmute audio |

---

## 📂 Project Structure

```text
.
├── index.html              # Main IPTV app shell
├── 404.html                # Single-page fallback for GitHub Pages
├── CNAME                   # Custom domain configuration (iptv.trionine.com)
├── css/
│   ├── app.css             # Base design tokens, resets, header navigation
│   ├── theme.css           # Streamdeck dark visual theme overrides
│   ├── player.css          # Video player container and custom playback controls
│   ├── guide.css           # Slide-out channel guide and category sidebar
│   ├── catalog.css         # Grid layouts, channel tiles, and watch-more recommendations
│   ├── playlist-modal.css  # M3U playlist importer & preset manager modal
│   ├── mobile.css          # Mobile bottom tab-bar, touch layout, responsive sheets
│   └── chat.css            # Live chat panel styling
├── js/
│   ├── channel-catalog.js  # Default curated 24/7 channels (permanent streams)
│   ├── playlist-manager.js # M3U parser, local file reader, and preset manager
│   ├── stream-player.js    # HLS.js, MPEG-TS, and YouTube playback engine
│   ├── ui-renderer.js      # DOM rendering, category tabs, and search filtering
│   ├── tv-input-manager.js # Smart TV remote and spatial navigation controller
│   ├── embed-providers.js  # Live event and match embed provider logic
│   └── bootstrap.js        # Core event routing, URL parameters, and app init
└── cf-workers/
    └── http-proxy.js       # Cloudflare Worker reverse proxy script (CORS & HTTPS bridge)
```

---

## 🛠️ Configuration & Customization

### 1. Customizing the Default Channel Catalog
Edit [`js/channel-catalog.js`](js/channel-catalog.js) to configure the default channels loaded when a visitor opens your site:
```javascript
let CHANNELS_DATA = {
  categories: [
    {
      name: "Sports",
      channels: [
        {
          id: "my-channel-id",
          name: "Channel Name",
          shortName: "CH1",
          logo: "assets/logos/my-logo.png",
          streams: [
            { label: "Primary HD", url: "https://example.com/live.m3u8" },
            { label: "Backup", url: "https://backup.example.com/live.m3u8" }
          ]
        }
      ]
    }
  ]
};
```

### 2. Setting Up the Cloudflare Worker Proxy
When hosting on `https://`, browsers block insecure `http://` video chunks. The included Cloudflare Worker acts as a secure bridge:
1. Copy the code from [`cf-workers/http-proxy.js`](cf-workers/http-proxy.js).
2. Create a new Cloudflare Worker (e.g. `iptv-proxy.your-subdomain.workers.dev`).
3. Paste the code and deploy.
4. The worker automatically includes origin authorization so third-party leechers cannot steal your worker quota.

---

## 📄 License & Disclaimer

- **Code License**: Released under the [MIT License](LICENSE).
- **Content Disclaimer**: This project does not host, store, or transmit any video content or media streams. All media streams are accessed directly from third-party publicly accessible URLs provided by the user or publicly available community directories (e.g. iptv-org).
