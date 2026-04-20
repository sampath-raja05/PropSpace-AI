const DEFAULT_LOCAL_API_BASE_URL = "http://localhost:8000/api/v1";
export const authProxyBaseUrl = "/api/backend";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function isLocalApiBaseUrl(baseUrl: string) {
  try {
    const hostname = new URL(baseUrl).hostname.toLowerCase();
    return hostname === "localhost" || hostname === "::1" || hostname === "0.0.0.0" || hostname.startsWith("127.");
  } catch {
    return false;
  }
}

export function joinApiUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

export function getBrowserApiBaseUrl() {
  return authProxyBaseUrl;
}

export function getServerApiBaseUrls() {
  const candidates = [process.env.API_BASE_URL_INTERNAL, process.env.NEXT_PUBLIC_API_BASE_URL];

  if (process.env.NODE_ENV !== "production") {
    candidates.push(DEFAULT_LOCAL_API_BASE_URL);
  }

  const normalizedCandidates = candidates
    .filter((candidate): candidate is string => Boolean(candidate))
    .map(normalizeBaseUrl);
  const productionSafeCandidates =
    process.env.NODE_ENV === "production"
      ? normalizedCandidates.filter((candidate) => !isLocalApiBaseUrl(candidate))
      : normalizedCandidates;

  return Array.from(new Set(productionSafeCandidates));
}
