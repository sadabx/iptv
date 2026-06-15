// ── Proxy Configuration
const DEFAULT_PROXY_URL = "https://iptv-proxy.trionine.workers.dev/?url=";

function getProxiedUrl(url) {
    if (!url) return "";
    const proxySetting = localStorage.getItem("iptv-proxy-url") || DEFAULT_PROXY_URL;
    if (proxySetting && window.location.protocol === "https:" && url.startsWith("http://")) {
        return proxySetting + encodeURIComponent(url);
    }
    return url;
}

let hlsPlayer = null;
let mpegtsPlayer = null;
let currentPlayingUrl = "";
let currentPlayingName = "";

// We'll initialize these DOM element references on DOMContentLoaded
let $video, $playerTitle, $playerEngine, $playerOverlay, $playerOverlayText, $playerSpinner;

document.addEventListener("DOMContentLoaded", () => {
    $video = document.getElementById("preview-video");
    $playerTitle = document.getElementById("player-title");
    $playerEngine = document.getElementById("player-engine");
    $playerOverlay = document.getElementById("player-overlay");
    $playerOverlayText = document.getElementById("player-overlay-text");
    $playerSpinner = document.getElementById("player-spinner");
});

function isTsUrl(url) {
    if (!url) return false;
    return /\.(ts|mpegts|m2ts)(\?|$)/i.test(url);
}

function showPlayerLoading(isLoading, message = "") {
    if (!$playerOverlay) return;
    if (isLoading) {
        $playerOverlay.classList.remove("hidden");
        if ($playerSpinner) $playerSpinner.style.display = "block";
        if ($playerOverlayText) $playerOverlayText.textContent = message || "Loading preview stream...";
    } else {
        $playerOverlay.classList.add("hidden");
        if ($playerSpinner) $playerSpinner.style.display = "none";
    }
}

function showPlayerError(message) {
    if (!$playerOverlay) return;
    $playerOverlay.classList.remove("hidden");
    if ($playerSpinner) $playerSpinner.style.display = "none";
    if ($playerOverlayText) $playerOverlayText.textContent = message;
}

function playSelectedLink(url, name = "Stream Preview") {
    currentPlayingUrl = url;
    currentPlayingName = name;
    if ($playerTitle) {
        $playerTitle.textContent = `Preview: ${name}`;
        $playerTitle.title = name;
    }

    // Auto decode token if available
    processTokenAuto(url);

    const proxiedUrl = getProxiedUrl(url);

    // Clean up previous engines
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }
    if (mpegtsPlayer) {
        mpegtsPlayer.destroy();
        mpegtsPlayer = null;
    }

    // Reset video element to clear previous errors and source
    const $vid = document.getElementById("preview-video");
    if (!$vid) return;
    $vid.pause();
    $vid.removeAttribute("src");
    $vid.load();

    showPlayerLoading(true);

    if (isTsUrl(url)) {
        if ($playerEngine) {
            $playerEngine.textContent = "MpegTS.js";
            $playerEngine.style.background = "#10b981";
            $playerEngine.style.color = "#fff";
        }

        if (mpegts.getFeatureList().mseLivePlayback) {
            mpegtsPlayer = mpegts.createPlayer({
                type: "mpegts",
                isLive: true,
                url: proxiedUrl
            }, {
                enableWorker: true,
                lazyLoadMaxDuration: 3 * 60,
                seekType: "range"
            });
            mpegtsPlayer.attachMediaElement($vid);
            mpegtsPlayer.load();
            mpegtsPlayer.play()
                .then(() => showPlayerLoading(false))
                .catch((e) => {
                    console.warn("mpegts play error:", e);
                    showPlayerError("Playback failed (check CORS/network)");
                });

            mpegtsPlayer.on(mpegts.Events.ERROR, (type, detail, info) => {
                console.error("MpegTS Player Error:", type, detail, info);
                showPlayerError(`MpegTS Error: ${detail || type}`);
            });
        } else {
            showPlayerError("MPEG-TS playback not supported on this browser.");
        }
    } else if (url.includes(".m3u8") || url.includes("m3u8")) {
        if ($playerEngine) {
            $playerEngine.textContent = "HLS.js";
            $playerEngine.style.background = "#3b82f6";
            $playerEngine.style.color = "#fff";
        }

        if (Hls.isSupported()) {
            hlsPlayer = new Hls({ enableWorker: true });
            hlsPlayer.loadSource(proxiedUrl);
            hlsPlayer.attachMedia($vid);
            hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
                $vid.play()
                    .then(() => showPlayerLoading(false))
                    .catch((e) => {
                        console.warn("hls play error:", e);
                        showPlayerError("Playback failed (click play button)");
                    });
            });
            hlsPlayer.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("HLS Fatal Error:", data);
                    showPlayerError(`Playback Error: ${data.details}`);
                }
            });
        } else if ($vid.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS support
            $vid.src = proxiedUrl;
            $vid.play()
                .then(() => showPlayerLoading(false))
                .catch(() => showPlayerError("Playback failed"));
        } else {
            showPlayerError("HLS playback not supported on this browser.");
        }
    } else {
        // Native fallback (MP4, WebM, etc)
        if ($playerEngine) {
            $playerEngine.textContent = "Native";
            $playerEngine.style.background = "#71717a";
            $playerEngine.style.color = "#fff";
        }

        $vid.src = proxiedUrl;
        $vid.play()
            .then(() => showPlayerLoading(false))
            .catch(() => showPlayerError("Playback failed (check codec/CORS)"));
    }
}

function retryPreviewStream() {
    if (currentPlayingUrl) {
        playSelectedLink(currentPlayingUrl, currentPlayingName);
    } else {
        showToastNotification("No active stream selected to reload!");
    }
}

async function checkSingleLink() {
    const urlInput = document.getElementById("single-url");
    if (!urlInput) return;
    const url = urlInput.value.trim();
    if (!url) {
        return alert("Please enter/paste a stream URL to test!");
    }

    const resultBox = document.getElementById("single-result-box");
    const statusDot = document.getElementById("single-status-dot");
    const statusText = document.getElementById("single-status-text");
    const checkBtn = document.getElementById("check-single-btn");

    if (checkBtn) {
        checkBtn.disabled = true;
        checkBtn.textContent = "Testing...";
    }
    if (resultBox) resultBox.classList.add("active");
    if (statusDot) statusDot.style.background = "#f59e0b";
    if (statusText) {
        statusText.style.color = "#f59e0b";
        statusText.textContent = "Checking network response...";
    }

    const result = await checkLink(url);
    if (checkBtn) {
        checkBtn.disabled = false;
        checkBtn.textContent = "Test & Play";
    }

    if (result.status === "online") {
        if (statusDot) statusDot.style.background = "#10b981";
        if (statusText) {
            statusText.style.color = "#10b981";
            statusText.textContent = `Online - Status Code: ${result.code}`;
        }
        showToastNotification("✓ Link is Online! Starting preview...");
    } else if (result.status === "cors") {
        if (statusDot) statusDot.style.background = "#f59e0b";
        if (statusText) {
            statusText.style.color = "#f59e0b";
            statusText.textContent = "CORS (Alive but browser restricted)";
        }
        showToastNotification("⚠ Link is CORS-restricted (might fail to play)");
    } else {
        if (statusDot) statusDot.style.background = "#ef4444";
        if (statusText) {
            statusText.style.color = "#ef4444";
            statusText.textContent = `Offline: ${result.code}`;
        }
        showToastNotification("❌ Link is Offline!");
    }

    // Play the stream immediately
    playSelectedLink(url, "Single Link Test");
}

const CONCURRENCY_LIMIT = 20; // Increased concurrency to chew through 300+ items rapidly
let auditedStreams = [];
let activeFilterType = "all";

async function startBulkAudit() {
    const inputData = document.getElementById("m3u-input").value.trim();
    if (!inputData)
        return alert(
            "Please paste your M3U list data content strings first!",
        );

    document.getElementById("run-btn").disabled = true;
    const consoleLogs = document.getElementById("console-logs");
    consoleLogs.innerHTML = "";
    auditedStreams = [];

    // Parse lines
    const lines = inputData.split("\n");

    // Base URL detection
    let baseUrl = document.getElementById("bulk-base-url") ? document.getElementById("bulk-base-url").value.trim() : "";
    if (!baseUrl) {
        // Attempt auto-detection from first few lines of input data (like comments or metadata)
        const firstLines = lines.slice(0, 10);
        for (let line of firstLines) {
            const trimmed = line.trim();
            const urlMatch = trimmed.match(/(https?:\/\/[^\s"'<>\(\),;\|]+)/i);
            if (urlMatch) {
                const fullUrl = urlMatch[1];
                try {
                    const urlObj = new URL(fullUrl);
                    const lastSlash = urlObj.pathname.lastIndexOf("/");
                    if (lastSlash !== -1) {
                        urlObj.pathname = urlObj.pathname.substring(0, lastSlash + 1);
                    }
                    urlObj.search = "";
                    urlObj.hash = "";
                    baseUrl = urlObj.href;
                    console.log("Auto-detected Base URL:", baseUrl);
                } catch (e) { }
                break;
            }
        }
    }

    let currentName = "";
    let currentStreamInf = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // 1. Check for HLS Master Playlist sub-stream metadata tag
        if (line.startsWith("#EXT-X-STREAM-INF:")) {
            const resolutionMatch = line.match(/RESOLUTION=([0-9x]+)/i);
            const bandwidthMatch = line.match(/BANDWIDTH=([0-9]+)/i);
            const resolution = resolutionMatch ? resolutionMatch[1] : "";
            const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1], 10) : 0;

            let bwText = "";
            if (bandwidth > 0) {
                if (bandwidth >= 1000000) {
                    bwText = `${(bandwidth / 1000000).toFixed(2)} Mbps`;
                } else {
                    bwText = `${(bandwidth / 1000).toFixed(0)} Kbps`;
                }
            }

            currentStreamInf = {
                resolution: resolution,
                bandwidth: bwText
            };
            continue;
        }

        // 2. Check for standard M3U metadata
        if (line.startsWith("#EXTINF:")) {
            // Extract the display name from the end of the line (after the last comma)
            const commaIndex = line.lastIndexOf(",");
            if (commaIndex !== -1) {
                currentName = line.substring(commaIndex + 1).trim();
            } else {
                // Try to find name in tvg-name or similar tags, or just use the whole line
                const tvgNameMatch = line.match(/tvg-name="([^"]+)"/i);
                if (tvgNameMatch) {
                    currentName = tvgNameMatch[1];
                } else {
                    currentName = line.replace("#EXTINF:", "").trim();
                }
            }
            // Clean up any double quotes wrapping the name
            currentName = currentName.replace(/^["']|["']$/g, "").trim();
            continue;
        }

        // 3. Check if this line is a stream URL (absolute or relative)
        const isAbsoluteUrl = /^(https?:\/\/)/i.test(line);
        const isRelativeUrl = !line.startsWith("#") && (line.includes(".m3u8") || line.includes(".ts") || line.includes(".mp4") || line.includes(".mkv") || line.includes("/chunks_dvr"));

        if (isAbsoluteUrl || isRelativeUrl) {
            let url = line;

            // Resolve relative URLs using base URL if available
            if (isRelativeUrl && baseUrl) {
                try {
                    url = new URL(line, baseUrl).href;
                } catch (e) {
                    console.warn("Relative URL resolution failed:", e);
                }
            }

            // Determine display name
            let name = "";

            if (currentStreamInf) {
                // Extract segment label before filename (excluding token path segments containing '=')
                let pathLabel = "";
                try {
                    const cleanUrl = url.split("?")[0].split("~")[0];
                    const segments = cleanUrl.split("/");
                    for (let j = segments.length - 1; j >= 0; j--) {
                        const seg = segments[j];
                        if (seg && !seg.includes(".m3u8") && !seg.includes(".ts") && !seg.includes("=") && seg !== "chunks_dvr" && seg !== "index" && seg !== "play") {
                            pathLabel = seg;
                            break;
                        }
                    }
                } catch (e) { }

                if (!pathLabel) pathLabel = "Sub-stream";

                name = `${pathLabel} (${currentStreamInf.resolution || "Auto"}${currentStreamInf.bandwidth ? " @ " + currentStreamInf.bandwidth : ""})`;
                currentStreamInf = null; // reset
            } else if (currentName) {
                name = currentName;
                currentName = ""; // reset
            }

            // If name is still empty, try same-line parsing
            if (!name) {
                let restOfLine = isAbsoluteUrl ? line.replace(url, "").trim() : "";

                restOfLine = restOfLine.replace(/[a-zA-Z0-9_-]+="[^"]*"/g, "");
                restOfLine = restOfLine.replace(/[a-zA-Z0-9_-]+=[^\s]*/g, "");

                restOfLine = restOfLine.replace(/^[,;\|:\-\s="]+|[,;\|:\-\s="]+$/g, "").trim();
                restOfLine = restOfLine.replace(/^\[|\]$|^\(|\)$/g, "").trim();

                if (restOfLine && restOfLine.length >= 1 && !restOfLine.startsWith("#")) {
                    name = restOfLine;
                } else {
                    try {
                        const urlObj = new URL(url);
                        const pathname = urlObj.pathname;
                        const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
                        if (lastSegment && lastSegment.includes('.')) {
                            name = lastSegment.substring(0, lastSegment.lastIndexOf('.'));
                        } else {
                            name = urlObj.hostname;
                        }
                        name = decodeURIComponent(name).replace(/[_\-\+]+/g, ' ').trim();
                        if (!name || name.length < 2) {
                            name = urlObj.hostname;
                        }
                    } catch (e) {
                        name = "Unnamed Channel";
                    }
                }
            }

            name = name.replace(/^["']|["']$/g, "").trim();

            auditedStreams.push({
                name: name || "Unnamed Channel",
                url: url,
                status: "waiting",
                code: "—",
                isGreen: false,
            });
        }
    }

    let total = auditedStreams.length;
    let processed = 0;
    let working = 0;
    let dead = 0;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-progress").textContent = processed;
    document.getElementById("stat-working").textContent = working;
    document.getElementById("stat-dead").textContent = dead;

    if (total === 0) {
        consoleLogs.innerHTML = `<div style="color:#ef4444; padding:10px;">Parser Error: Zero source links resolved. Check file layout tags.</div>`;
        document.getElementById("run-btn").disabled = false;
        return;
    }

    // Parallel HTTP Queue Probers
    const queueIterator = auditedStreams.entries();

    const workerPool = async () => {
        for (let [index, item] of queueIterator) {
            if (
                item.url.includes("://10.16.") ||
                item.url.includes("://192.168.")
            ) {
                processed++;
                dead++;
                item.status = "dead";
                item.code = "LAN Block";
                document.getElementById("stat-progress").textContent = processed;
                document.getElementById("stat-dead").textContent = dead;
                appendLogToDOM(item, index);
                continue;
            }

            const result = await checkLink(item.url);
            processed++;
            document.getElementById("stat-progress").textContent = processed;

            if (result.status === "online") {
                working++;
                item.status = "online";
                item.isGreen = true; // Flawless HTTP 200 OK links are tagged as pure Green
                item.code = `OK (${result.code})`;
                document.getElementById("stat-working").textContent = working;
            } else if (result.status === "cors") {
                working++;
                item.status = "online";
                item.isGreen = false; // CORS elements are alive but restricted inside browsers
                item.code = "CORS (Alive)";
                document.getElementById("stat-working").textContent = working;
            } else {
                dead++;
                item.status = "dead";
                item.code = result.code;
                document.getElementById("stat-dead").textContent = dead;
            }
            appendLogToDOM(item, index);
        }
    };

    const workers = Array(Math.min(CONCURRENCY_LIMIT, total))
        .fill(null)
        .map(workerPool);
    await Promise.all(workers);

    document.getElementById("run-btn").disabled = false;
    showToastNotification("✓ Complete audit pipeline loop completed");
}

function checkLink(url) {
    return new Promise(async (resolve) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000); // 4s slightly more aggressive timeout window

        const targetUrl = getProxiedUrl(url);

        try {
            const res = await fetch(targetUrl, {
                method: "GET",
                signal: controller.signal,
                headers: { Accept: "*/*" },
            });
            clearTimeout(timer);
            if (res.ok) resolve({ status: "online", code: res.status });
            else resolve({ status: "offline", code: `HTTP ${res.status}` });
        } catch (err) {
            clearTimeout(timer);
            if (err.name === "AbortError")
                resolve({ status: "offline", code: "Timeout" });
            else resolve({ status: "cors", code: "CORS" });
        }
    });
}

function appendLogToDOM(item, index) {
    const consoleLogs = document.getElementById("console-logs");
    const entry = document.createElement("div");

    let statusClass = item.status === "online" ? "working" : "dead";
    if (item.code === "CORS (Alive)") statusClass = "cors";

    entry.className = `log-entry ${statusClass}`;
    entry.id = `log-id-${index}`;
    entry.dataset.name = item.name.toLowerCase();
    entry.dataset.status = item.status;
    entry.dataset.green = item.isGreen ? "true" : "false";

    entry.innerHTML = `
            <div><strong>${item.name}</strong> <span style="font-size:10px; margin-left:8px; opacity:0.85;">[${item.code}]</span></div>
            <div class="log-url" title="${item.url}">${item.url}</div>
        `;

    entry.addEventListener("click", () => {
        document
            .querySelectorAll(".log-entry")
            .forEach((el) => el.classList.remove("active-playing"));
        entry.classList.add("active-playing");
        playSelectedLink(item.url, item.name);
    });

    consoleLogs.appendChild(entry);

    // Match sorting viewport states immediately
    evaluateVisibilityFilterForNode(entry);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

function changeActiveFilter(filterType, buttonEl) {
    activeFilterType = filterType;
    document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
    buttonEl.classList.add("active");
    applyOutputFilters();
}

/**
 * Unified Filter Engine: Intersects Text Query String with Status Badges
 */
function applyOutputFilters() {
    const query = document
        .getElementById("search-filter")
        .value.toLowerCase()
        .trim();

    document.querySelectorAll(".log-entry").forEach((entry) => {
        const matchesSearch = !query || entry.dataset.name.includes(query);
        let matchesStatus = false;

        if (activeFilterType === "all") {
            matchesStatus = true;
        } else if (activeFilterType === "online") {
            matchesStatus = entry.dataset.status === "online";
        } else if (activeFilterType === "green") {
            matchesStatus = entry.dataset.green === "true";
        } else if (activeFilterType === "dead") {
            matchesStatus = entry.dataset.status === "dead";
        }

        if (matchesSearch && matchesStatus) {
            entry.style.display = "";
        } else {
            entry.style.display = "none";
        }
    });
}

function evaluateVisibilityFilterForNode(node) {
    const query = document
        .getElementById("search-filter")
        .value.toLowerCase()
        .trim();
    const matchesSearch = !query || node.dataset.name.includes(query);
    let matchesStatus = false;

    if (activeFilterType === "all") matchesStatus = true;
    else if (activeFilterType === "online")
        matchesStatus = node.dataset.status === "online";
    else if (activeFilterType === "green")
        matchesStatus = node.dataset.green === "true";
    else if (activeFilterType === "dead")
        matchesStatus = node.dataset.status === "dead";

    node.style.display = matchesSearch && matchesStatus ? "" : "none";
}

function copyFilteredToClipboard() {
    if (auditedStreams.length === 0)
        return alert("Audit a dataset first before executing export calls!");
    const query = document
        .getElementById("search-filter")
        .value.toLowerCase()
        .trim();

    // Compile matches intersecting both filters
    const filteredCollection = auditedStreams.filter((item) => {
        const matchesSearch =
            !query || item.name.toLowerCase().includes(query);
        let matchesStatus = false;

        if (activeFilterType === "all") matchesStatus = true;
        else if (activeFilterType === "online")
            matchesStatus = item.status === "online";
        else if (activeFilterType === "green") matchesStatus = item.isGreen;
        else if (activeFilterType === "dead")
            matchesStatus = item.status === "dead";

        return matchesSearch && matchesStatus;
    });

    if (filteredCollection.length === 0) {
        return alert(
            "No stream components match your active search and filter constraints.",
        );
    }

    let m3uTemplate = "#EXTM3U\n";
    filteredCollection.forEach((item) => {
        m3uTemplate += `#EXTINF:-1,${item.name}\n${item.url}\n`;
    });

    navigator.clipboard
        .writeText(m3uTemplate)
        .then(() => {
            showToastNotification(
                `✓ Exported ${filteredCollection.length} channels to clipboard!`,
            );
        })
        .catch(() => {
            alert(
                "Clipboard capture blocked by operating system security restrictions.",
            );
        });
}

function showToastNotification(msg) {
    const toast = document.createElement("div");
    toast.style.cssText =
        "position:fixed; bottom:24px; right:24px; background:#10b981; color:white; padding:12px 24px; border-radius:6px; font-size:0.8rem; font-weight:600; z-index:99999; box-shadow:0 10px 25px rgba(0,0,0,0.6); animation: tIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// --- Token Decoder Integration Functions ---
function switchPlayerTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`content-${tabName}`).classList.add('active');
}

function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function extractAndDecodeToken(input) {
    let cleanInput = input.trim();
    if (!cleanInput) return null;

    // 1. If it's a full URL path, isolate the specific token block segment
    if (cleanInput.includes('/')) {
        const urlParts = cleanInput.split('/');
        let lastSegment = urlParts[urlParts.length - 1];
        if (lastSegment.includes('.')) {
            const dotParts = lastSegment.split('.');
            cleanInput = dotParts[0];
        } else {
            cleanInput = lastSegment;
        }
    }

    // 2. JWT blocks contain 3 parts separated by dots (Header.Payload.Signature)
    const tokenSegments = cleanInput.split('.');
    let targetPayloadBase64 = tokenSegments.length >= 2 ? tokenSegments[1] : tokenSegments[0];

    // 3. Decode the Base64URL string
    const decodedJsonString = base64UrlDecode(targetPayloadBase64);
    return JSON.parse(decodedJsonString);
}

function renderDecoderUI(payloadObj) {
    const jsonOutput = document.getElementById('decoder-json-output');
    const analysisBody = document.getElementById('decoder-analysis-body');

    // Render pretty-printed raw JSON
    jsonOutput.textContent = JSON.stringify(payloadObj, null, 2);
    jsonOutput.style.color = '#10b981';

    // Populate constraints table
    analysisBody.innerHTML = '';
    let rowsHtml = '';

    for (const [key, value] of Object.entries(payloadObj)) {
        let explanation = '';
        let displayValue = typeof value === 'object' ? JSON.stringify(value) : value;

        if (key === 'exp') {
            const dateObj = new Date(value > 9999999999 ? value : value * 1000);
            explanation = `<br><span style="color: #f59e0b; font-size: 11px;">⏰ Expires: ${dateObj.toLocaleString()}</span>`;
        } else if (key === 'vip') {
            explanation = `<br><span style="color: #ef4444; font-size: 11px;">🔒 Locked to this extraction IP address</span>`;
        } else if (key === 'oru') {
            explanation = `<br><span style="color: #a1a1aa; font-size: 11px;">🔗 Underlying source stream file directory</span>`;
        } else if (key === 'uid' || key === 'sid' || key === 'did') {
            explanation = `<br><span style="color: #a1a1aa; font-size: 11px;">ID parameter tracking hash</span>`;
        }

        rowsHtml += `
            <tr>
              <td><span class="decoder-param-key">${escapeHtml(key)}</span></td>
              <td>
                <div class="decoder-param-val">${escapeHtml(String(displayValue))}</div>
                ${explanation}
              </td>
            </tr>
          `;
    }

    analysisBody.innerHTML = rowsHtml;
}

function resetDecoderUI(message = "No token parsed yet") {
    document.getElementById('decoder-json-output').textContent = "// Decoded JSON structure will render here...";
    document.getElementById('decoder-json-output').style.color = "#a1a1aa";
    document.getElementById('decoder-analysis-body').innerHTML = `
          <tr>
            <td colspan="2" style="color: #71717a; text-align: center; padding: 20px 10px;">
              ${message}
            </td>
          </tr>
        `;
}

function processTokenManual() {
    const errorBanner = document.getElementById('decoder-error-banner');
    errorBanner.style.display = 'none';

    const input = document.getElementById('token-input').value.trim();
    if (!input) {
        resetDecoderUI("No token parsed yet");
        return;
    }

    try {
        const payload = extractAndDecodeToken(input);
        renderDecoderUI(payload);
        showToastNotification("✓ Token decoded successfully!");
    } catch (err) {
        resetDecoderUI("Analysis failed");
        errorBanner.textContent = "Error: Invalid token string format or broken Base64 layout payload.";
        errorBanner.style.display = 'block';
    }
}

function processTokenAuto(url) {
    const indicator = document.getElementById('decoder-indicator');
    const tokenInput = document.getElementById('token-input');
    const errorBanner = document.getElementById('decoder-error-banner');

    if (errorBanner) errorBanner.style.display = 'none';

    if (!url) {
        if (indicator) indicator.style.display = 'none';
        resetDecoderUI("No active stream selected");
        return;
    }

    // Put the URL in the input field so they see what is being analyzed
    if (tokenInput) tokenInput.value = url;

    try {
        const payload = extractAndDecodeToken(url);
        renderDecoderUI(payload);
        if (indicator) indicator.style.display = 'inline-block';
    } catch (err) {
        // Silent fail for auto-detect (it might not be a token-based stream)
        if (indicator) indicator.style.display = 'none';
        resetDecoderUI("No secure token detected in active stream");
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}