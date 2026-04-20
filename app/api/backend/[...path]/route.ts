import { NextResponse } from "next/server";

import { getServerApiBaseUrls, joinApiUrl } from "@/lib/api-targets";
import { handleLocalBackendRequest } from "@/lib/server/local-backend";

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "origin",
  "referer",
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const API_TARGET_COOLDOWN_MS = 15_000;
const unavailableTargets = new Map<string, number>();

function forwardRequestHeaders(headers: Headers) {
  const forwardedHeaders = new Headers(headers);

  for (const header of HOP_BY_HOP_REQUEST_HEADERS) {
    forwardedHeaders.delete(header);
  }

  return forwardedHeaders;
}

function forwardResponseHeaders(headers: Headers) {
  const forwardedHeaders = new Headers(headers);

  for (const header of HOP_BY_HOP_RESPONSE_HEADERS) {
    forwardedHeaders.delete(header);
  }

  return forwardedHeaders;
}

function isLocalApiBaseUrl(baseUrl: string) {
  try {
    const hostname = new URL(baseUrl).hostname.toLowerCase();
    return hostname === "localhost" || hostname === "::1" || hostname === "0.0.0.0" || hostname.startsWith("127.");
  } catch {
    return false;
  }
}

function isTargetInCooldown(baseUrl: string) {
  const retryAt = unavailableTargets.get(baseUrl);

  if (!retryAt) {
    return false;
  }

  if (retryAt <= Date.now()) {
    unavailableTargets.delete(baseUrl);
    return false;
  }

  return true;
}

function markTargetUnavailable(baseUrl: string) {
  unavailableTargets.set(baseUrl, Date.now() + API_TARGET_COOLDOWN_MS);
}

function markTargetAvailable(baseUrl: string) {
  unavailableTargets.delete(baseUrl);
}

async function proxyRequest(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const apiPath = `/${params.path.join("/")}`;
  const search = new URL(request.url).search;
  const headers = forwardRequestHeaders(request.headers);
  const method = request.method.toUpperCase();
  const bodyBuffer = method === "GET" || method === "HEAD" ? null : await request.arrayBuffer();
  const body = bodyBuffer ?? undefined;
  const baseUrls = getServerApiBaseUrls().filter((baseUrl) => !isTargetInCooldown(baseUrl));

  let lastError: unknown = null;

  if (baseUrls.length === 0) {
    return handleLocalBackendRequest({
      bodyText: bodyBuffer ? Buffer.from(bodyBuffer).toString("utf8") : null,
      path: params.path,
      request,
      searchParams: new URL(request.url).searchParams,
    });
  }

  for (const baseUrl of baseUrls) {
    try {
      const response = await fetch(`${joinApiUrl(baseUrl, apiPath)}${search}`, {
        method,
        headers,
        body,
        cache: "no-store",
        redirect: "manual",
      });
      markTargetAvailable(baseUrl);

      if (response.status >= 500 && isLocalApiBaseUrl(baseUrl)) {
        const responseText = await response.text();
        console.warn("API proxy received a server error from local API target, using local fallback instead", {
          apiPath,
          baseUrl,
          responseText,
          status: response.status,
        });
        markTargetUnavailable(baseUrl);
        lastError = new Error(`Local API target returned ${response.status}`);
        continue;
      }

      return new Response(response.body, {
        status: response.status,
        headers: forwardResponseHeaders(response.headers),
      });
    } catch (error) {
      markTargetUnavailable(baseUrl);
      lastError = error;
    }
  }

  if (process.env.NODE_ENV === "production") {
    console.error("API proxy failed for all configured targets", lastError);
  } else if (lastError) {
    console.warn("API proxy targets are unavailable in development, using local fallback", lastError);
  }

  return handleLocalBackendRequest({
    bodyText: bodyBuffer ? Buffer.from(bodyBuffer).toString("utf8") : null,
    path: params.path,
    request,
    searchParams: new URL(request.url).searchParams,
  });
}

export const dynamic = "force-dynamic";

export {
  proxyRequest as DELETE,
  proxyRequest as GET,
  proxyRequest as HEAD,
  proxyRequest as OPTIONS,
  proxyRequest as PATCH,
  proxyRequest as POST,
  proxyRequest as PUT,
};
