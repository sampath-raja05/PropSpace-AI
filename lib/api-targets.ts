import { appConfig } from "@/lib/constants";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function joinApiUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

export function getServerApiBaseUrls() {
  const candidates = [
    process.env.API_BASE_URL_INTERNAL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    appConfig.apiBaseUrl,
    DEFAULT_API_BASE_URL,
  ];

  return Array.from(new Set(candidates.filter((candidate): candidate is string => Boolean(candidate)).map(normalizeBaseUrl)));
}

export const authProxyBaseUrl = "/api/backend";
