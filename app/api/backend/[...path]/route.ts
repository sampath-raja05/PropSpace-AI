import { NextResponse } from "next/server";

import { getServerApiBaseUrls, joinApiUrl } from "@/lib/api-targets";

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

async function proxyRequest(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const apiPath = `/${params.path.join("/")}`;
  const search = new URL(request.url).search;
  const headers = forwardRequestHeaders(request.headers);
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  let lastError: unknown = null;

  for (const baseUrl of getServerApiBaseUrls()) {
    try {
      const response = await fetch(`${joinApiUrl(baseUrl, apiPath)}${search}`, {
        method,
        headers,
        body,
        cache: "no-store",
        redirect: "manual",
      });

      return new Response(response.body, {
        status: response.status,
        headers: forwardResponseHeaders(response.headers),
      });
    } catch (error) {
      lastError = error;
    }
  }

  console.error("API proxy failed for all configured targets", lastError);

  return NextResponse.json(
    {
      detail: "Unable to reach the API server. Start the FastAPI backend on http://localhost:8000 and try again.",
      code: "api_unavailable",
    },
    { status: 502 }
  );
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
