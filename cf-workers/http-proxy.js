addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const url = new URL(request.url);
  let targetUrl = url.searchParams.get("url");

  // Fallback: Support path-based proxying if the '?url=' query parameter is missing
  if (!targetUrl) {
    const decodedReqUrl = decodeURIComponent(request.url);
    const proxyDomainEndIndex = decodedReqUrl.indexOf(".workers.dev/");
    if (proxyDomainEndIndex !== -1) {
      let targetPart = decodedReqUrl.substring(
        proxyDomainEndIndex + ".workers.dev/".length,
      );

      // Fix Cloudflare's double-slash collapsing (e.g. http:/some-domain -> http://some-domain)
      if (
        targetPart.startsWith("http:/") &&
        !targetPart.startsWith("http://")
      ) {
        targetPart = "http://" + targetPart.substring(6);
      } else if (
        targetPart.startsWith("https:/") &&
        !targetPart.startsWith("https://")
      ) {
        targetPart = "https://" + targetPart.substring(7);
      }

      if (
        targetPart.startsWith("http://") ||
        targetPart.startsWith("https://")
      ) {
        targetUrl = targetPart;
      }
    }
  }

  if (!targetUrl) {
    return new Response(
      "IPTV Reverse Proxy is active! Usage: ?url=http://... or /http://...",
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  try {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

    // Resolve raw IP hostname to use sslip.io to bypass Cloudflare IP restrictions
    let targetUrlObj;
    try {
      targetUrlObj = new URL(targetUrl);
    } catch (e) {
      // Fix double-slash collapsing if the URL fails to parse
      if (targetUrl.startsWith("http:/") && !targetUrl.startsWith("http://")) {
        targetUrlObj = new URL("http://" + targetUrl.substring(6));
      } else if (
        targetUrl.startsWith("https:/") &&
        !targetUrl.startsWith("https://")
      ) {
        targetUrlObj = new URL("https://" + targetUrl.substring(7));
      } else {
        throw e;
      }
      targetUrl = targetUrlObj.toString();
    }

    if (ipRegex.test(targetUrlObj.hostname)) {
      targetUrlObj.hostname = targetUrlObj.hostname + ".sslip.io";
      targetUrl = targetUrlObj.toString();
    }

    // Forward the request and handle redirects manually to rewrite IP redirects too
    let response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      redirect: "manual",
    });

    let redirectCount = 0;
    // Follow all redirects (300-399) internally up to 10 times
    while (
      response.status >= 300 &&
      response.status < 400 &&
      redirectCount < 10
    ) {
      let location = response.headers.get("location");
      if (!location) break;

      if (!location.startsWith("http://") && !location.startsWith("https://")) {
        location = new URL(location, targetUrl).toString();
      }

      const locUrlObj = new URL(location);
      if (ipRegex.test(locUrlObj.hostname)) {
        locUrlObj.hostname = locUrlObj.hostname + ".sslip.io";
      }
      targetUrl = locUrlObj.toString();

      response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        redirect: "manual",
      });
      redirectCount++;
    }

    // Check if the response is an HLS playlist (m3u8)
    const contentType = (
      response.headers.get("content-type") || ""
    ).toLowerCase();
    const isPlaylist =
      contentType.includes("mpegurl") ||
      contentType.includes("x-mpegurl") ||
      targetUrl.includes(".m3u8");

    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    newHeaders.set("Access-Control-Expose-Headers", "*");

    // If it's a redirect that we couldn't resolve, rewrite the Location header so it goes back through this proxy
    if (response.status >= 300 && response.status < 400) {
      let location = response.headers.get("location");
      if (location) {
        if (
          !location.startsWith("http://") &&
          !location.startsWith("https://")
        ) {
          location = new URL(location, targetUrl).toString();
        }
        newHeaders.set(
          "Location",
          url.origin + "/?url=" + encodeURIComponent(location),
        );
      }
    }

    if (isPlaylist && response.status === 200) {
      let text = await response.text();

      // Use path-based proxy URL prefix for absolute URLs to maintain path structure for relative segments
      const proxyUrlBase = url.origin + "/";

      // Rewrite any absolute http:// or https:// URLs inside the playlist to go through this proxy
      // Exclude matches that are already targeting the proxy worker domain itself
      text = text.replace(/(https?:\/\/[^\s"'#]+)/g, (match) => {
        if (!match.includes(url.hostname)) {
          return proxyUrlBase + match;
        }
        return match;
      });

      return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (err) {
    return new Response("Proxy error fetching stream: " + err.message, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
