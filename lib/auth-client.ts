import { authProxyBaseUrl } from "@/lib/api-targets";
import type { AuthUser, UserRole } from "@/types";

interface TokenResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    provider: AuthUser["provider"];
    avatar_url?: string | null;
    phone?: string | null;
  };
}

interface OTPRequestResponse {
  message: string;
  masked_destination: string;
  expires_in_seconds: number;
  resend_in_seconds: number;
  preview_code?: string | null;
}

class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

const DEMO_AUTH_STORAGE_KEY = "propspace-demo-session";
const DEMO_EMAIL = "aarav@propspace.ai";
const DEMO_PASSWORD = "demo-password";

function isBrowser() {
  return typeof window !== "undefined";
}

function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

function normalizeUser(user: TokenResponse["user"]): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider,
    avatarUrl: user.avatar_url ?? null,
    phone: user.phone ?? null,
  };
}

function createDemoUser(): AuthUser {
  return {
    id: "demo-investor",
    name: "Aarav Mehta",
    email: DEMO_EMAIL,
    role: "investor",
    provider: "password",
    avatarUrl: null,
    phone: null,
  };
}

function persistDemoUser(user: AuthUser) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(user));
}

function readDemoUser() {
  if (!isBrowser()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    return null;
  }
}

function clearDemoUser() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
}

function isDemoCredentials(payload: { email: string; password: string }) {
  return payload.email.trim().toLowerCase() === DEMO_EMAIL && payload.password === DEMO_PASSWORD;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${authProxyBaseUrl}${path}`, {
      credentials: "include",
      ...init,
      headers,
    });
  } catch {
    throw new ApiRequestError(
      "Unable to reach the application server. Refresh the page or restart the Next.js dev server.",
      0,
      "app_unavailable"
    );
  }

  if (!response.ok) {
    let detail = response.statusText || "Something went wrong";
    let code: string | undefined;

    try {
      const payload = (await response.json()) as { detail?: string; code?: string };
      detail = payload.detail ?? detail;
      code = payload.code;
    } catch {
      // Ignore JSON parsing errors and keep generic message.
    }

    throw new ApiRequestError(detail, response.status, code);
  }

  return (await response.json()) as T;
}

export async function loginWithPassword(payload: { email: string; password: string }) {
  try {
    const response = await request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    clearDemoUser();
    return normalizeUser(response.user);
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      error.code === "api_unavailable" &&
      isDevelopment() &&
      isDemoCredentials(payload)
    ) {
      const demoUser = createDemoUser();
      persistDemoUser(demoUser);
      return demoUser;
    }

    throw error;
  }
}

export async function registerWithPassword(payload: {
  name: string;
  email: string;
  password: string;
  role?: "investor" | "advisor";
}) {
  const response = await request<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeUser(response.user);
}

export async function requestOtp(payload: { name?: string; phoneNumber: string }) {
  const response = await request<OTPRequestResponse>("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      phone_number: payload.phoneNumber,
    }),
  });

  return {
    maskedDestination: response.masked_destination,
    expiresInSeconds: response.expires_in_seconds,
    resendInSeconds: response.resend_in_seconds,
    previewCode: response.preview_code ?? null,
  };
}

export async function verifyOtp(payload: { name?: string; phoneNumber: string; otp: string }) {
  const response = await request<TokenResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      phone_number: payload.phoneNumber,
      otp: payload.otp,
    }),
  });

  return normalizeUser(response.user);
}

export async function getCurrentSession() {
  try {
    const user = await request<TokenResponse["user"]>("/auth/me", {
      method: "GET",
    });
    clearDemoUser();
    return normalizeUser(user);
  } catch {
    return readDemoUser();
  }
}

export async function logoutSession() {
  try {
    await request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearDemoUser();
  }
}
