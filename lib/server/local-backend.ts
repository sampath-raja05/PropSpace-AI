import { createHash, createHmac, randomInt, randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { calculateEmi } from "@/lib/emi";
import {
  alertRules,
  cityAllocationSeries,
  dashboardMetrics,
  featuredProperties,
  getPropertyBySlug,
  marketMomentumSeries,
  portfolioHoldings,
  properties,
  propertyTypeSeries,
} from "@/lib/properties";
import type { AuthUser, UserRole } from "@/types";

const SESSION_COOKIE_NAME = "propspace_session";
const LOCAL_ACCOUNTS_COOKIE_NAME = "propspace_local_accounts";
const OTP_COOKIE_NAME = "propspace_otp_challenges";
const DEMO_EMAIL = "aarav@propspace.ai";
const DEMO_PASSWORD = "demo-password";
const OTP_EXPIRY_SECONDS = 5 * 60;
const OTP_RESEND_SECONDS = 60;
const SESSION_MAX_AGE_SECONDS = 120 * 60;
const TOKEN_TYPE = "bearer";

type SupportedRole = Extract<UserRole, "investor" | "advisor" | "admin">;

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  role: SupportedRole;
  provider: "password" | "otp";
  passwordHash?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: SupportedRole;
  provider: "password" | "otp";
  avatarUrl?: string | null;
  phone?: string | null;
}

interface OtpChallenge {
  codeHash: string;
  expiresAt: number;
  issuedAt: number;
  attemptsRemaining: number;
  name?: string | null;
}

interface LocalBackendRequest {
  bodyText: string | null;
  path: string[];
  request: Request;
  searchParams: URLSearchParams;
}

function getAuthSecret() {
  return process.env.JWT_SECRET_KEY ?? process.env.AUTH_SECRET ?? "propspace-local-auth";
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(value: string, maxLength = 82) {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxLength) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildSimplePdfBuffer(lines: string[]) {
  const sanitizedLines = lines.slice(0, 34);
  const content = [
    "BT",
    "/F1 12 Tf",
    ...sanitizedLines.flatMap((line, index) => [`1 0 0 1 50 ${790 - index * 20} Tm`, `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];
  const header = "%PDF-1.4\n";
  let offset = Buffer.byteLength(header, "utf8");
  const xref = ["0000000000 65535 f "];

  for (const object of objects) {
    xref.push(`${offset.toString().padStart(10, "0")} 00000 n `);
    offset += Buffer.byteLength(object, "utf8");
  }

  const xrefStart = offset;
  const trailer = `xref\n0 ${objects.length + 1}\n${xref.join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(`${header}${objects.join("")}${trailer}`, "utf8");
}

function buildPropertyPdf(propertyId: string) {
  const property = getPropertyBySlug(propertyId);

  if (!property) {
    return null;
  }

  const lines = [
    `${property.title} Report`,
    `${property.locality}, ${property.city}`,
    `Guide price: INR ${property.price.toLocaleString("en-IN")}`,
    `AI investment score: ${property.aiInvestmentScore}/100`,
    `Predicted price: INR ${property.predictedPrice.toLocaleString("en-IN")}`,
    `Overpricing signal: ${property.overpricingPercent.toFixed(1)}%`,
    `Rental yield: ${property.rentalYield.toFixed(1)}%`,
    "",
    "Highlights",
    ...property.highlights.map((highlight) => `- ${highlight}`),
    "",
    "AI commentary",
    ...wrapText(
      `${property.description} This report blends city benchmarks, configuration factors, and local comparables to estimate fair value.`
    ),
  ];

  return buildSimplePdfBuffer(lines);
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function hashPassword(value: string) {
  return createHash("sha256").update(`${getAuthSecret()}:${value}`).digest("hex");
}

function hashOtpCode(phoneNumber: string, otp: string) {
  return createHash("sha256").update(`${getAuthSecret()}:${phoneNumber}:${otp}`).digest("hex");
}

function serializeSignedCookie<T>(payload: T) {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${signValue(encoded)}`;
}

function parseSignedCookie<T>(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");

  if (!encoded || !signature || signValue(encoded) !== signature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(encoded)) as T;
  } catch {
    return null;
  }
}

function parseCookies(request: Request) {
  const rawCookieHeader = request.headers.get("cookie");
  const cookies = new Map<string, string>();

  if (!rawCookieHeader) {
    return cookies;
  }

  for (const part of rawCookieHeader.split(/;\s*/)) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = part.slice(0, separatorIndex);
    const value = part.slice(separatorIndex + 1);
    cookies.set(key, decodeURIComponent(value));
  }

  return cookies;
}

function getStoredAccounts(request: Request) {
  const cookies = parseCookies(request);
  return parseSignedCookie<StoredAccount[]>(cookies.get(LOCAL_ACCOUNTS_COOKIE_NAME)) ?? [];
}

function getStoredOtpChallenges(request: Request) {
  const cookies = parseCookies(request);
  return parseSignedCookie<Record<string, OtpChallenge>>(cookies.get(OTP_COOKIE_NAME)) ?? {};
}

function getSessionPayload(request: Request) {
  const cookies = parseCookies(request);
  return parseSignedCookie<SessionPayload>(cookies.get(SESSION_COOKIE_NAME));
}

function createJsonResponse(payload: unknown, init?: ResponseInit) {
  return NextResponse.json(payload, init);
}

function setSignedCookie(response: NextResponse, name: string, value: unknown, maxAge: number) {
  response.cookies.set({
    httpOnly: true,
    maxAge,
    name,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: serializeSignedCookie(value),
  });
}

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set({
    httpOnly: true,
    maxAge: 0,
    name,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: "",
  });
}

function toAuthUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    provider: account.provider,
    avatarUrl: account.avatarUrl ?? null,
    phone: account.phone ?? null,
  };
}

function createDemoAccount(): StoredAccount {
  return {
    id: "demo-investor",
    name: "Aarav Mehta",
    email: DEMO_EMAIL,
    passwordHash: hashPassword(DEMO_PASSWORD),
    provider: "password",
    role: "investor",
  };
}

function buildPhoneIdentity(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");

  return {
    email: `phone-${digits}@auth.propspace.ai`,
    id: `otp-${digits}`,
  };
}

function normalizePhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`;
  }

  throw new Error("Enter a valid mobile number");
}

function maskPhoneNumber(phoneNumber: string) {
  const visibleTail = phoneNumber.slice(-4);
  return `${phoneNumber.slice(0, 3)} ${"*".repeat(Math.max(phoneNumber.length - 7, 4))} ${visibleTail}`;
}

function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (new TextEncoder().encode(password).length > 72) {
    return "Password must be 72 bytes or fewer";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character";
  }

  return null;
}

function parseJsonBody<T>(bodyText: string | null) {
  if (!bodyText) {
    return null;
  }

  try {
    return JSON.parse(bodyText) as T;
  } catch {
    return null;
  }
}

function buildTokenResponse(user: AuthUser, response: NextResponse) {
  const provider = user.provider === "otp" ? "otp" : "password";

  setSignedCookie(
    response,
    SESSION_COOKIE_NAME,
    {
      avatarUrl: user.avatarUrl ?? null,
      email: user.email,
      id: user.id,
      name: user.name,
      phone: user.phone ?? null,
      provider,
      role: user.role,
    } satisfies SessionPayload,
    SESSION_MAX_AGE_SECONDS
  );

  return response;
}

function respondWithAuth(user: AuthUser) {
  const provider = user.provider === "otp" ? "otp" : "password";
  const response = createJsonResponse({
    access_token: serializeSignedCookie({
      email: user.email,
      id: user.id,
      provider,
      role: user.role,
    }),
    token_type: TOKEN_TYPE,
    user: {
      avatar_url: user.avatarUrl ?? null,
      email: user.email,
      id: user.id,
      name: user.name,
      phone: user.phone ?? null,
      provider,
      role: user.role,
    },
  });

  return buildTokenResponse(user, response);
}

function findPasswordAccount(accounts: StoredAccount[], email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === DEMO_EMAIL) {
    return createDemoAccount();
  }

  return accounts.find((account) => account.email === normalizedEmail && account.provider === "password") ?? null;
}

function cleanupOtpChallenges(challenges: Record<string, OtpChallenge>) {
  const now = Date.now();

  return Object.fromEntries(
    Object.entries(challenges).filter(([, challenge]) => challenge.expiresAt > now && challenge.attemptsRemaining > 0)
  );
}

function getPropertyMetrics(propertyId: string) {
  const property = getPropertyBySlug(propertyId);

  if (!property) {
    return null;
  }

  return {
    ai_investment_score: property.aiInvestmentScore,
    annual_appreciation: property.annualAppreciation,
    confidence: 0.86,
    overpricing_percent: property.overpricingPercent,
    predicted_price: property.predictedPrice,
    property_id: property.id,
    rental_yield: property.rentalYield,
  };
}

function getPropertyCommentary(propertyId: string) {
  const property = getPropertyBySlug(propertyId);

  if (!property) {
    return null;
  }

  const priceNote =
    property.overpricingPercent > 6
      ? "The current ask sits above our modeled fair-value band, so this one likely needs negotiation room to become compelling."
      : "The asking price sits close to our modeled fair-value band, which makes the entry case easier to support.";
  const scoreNote =
    property.aiInvestmentScore >= 82
      ? "The overall AI score points to a stronger-than-average setup for medium-term buyers."
      : "The overall AI score is respectable, but this looks more selective than high-conviction.";
  const yieldNote =
    property.rentalYield >= 3.2
      ? "Yield is solid enough to appeal to buyers who want some income support alongside appreciation."
      : "Returns look more appreciation-led than income-led at current pricing.";

  return {
    commentary: `${property.title} in ${property.locality}, ${property.city} looks investable on fundamentals, with projected appreciation of ${property.annualAppreciation.toFixed(1)}% and rental yield of ${property.rentalYield.toFixed(1)}%. ${priceNote} ${scoreNote} ${yieldNote}`,
    model: null,
    property_id: property.id,
    provider: "local-fallback",
  };
}

export async function handleLocalBackendRequest({
  bodyText,
  path,
  request,
  searchParams,
}: LocalBackendRequest) {
  const method = request.method.toUpperCase();
  const [resource, identifier, subresource] = path;

  if (!resource) {
    return createJsonResponse({ detail: "Not found" }, { status: 404 });
  }

  if (resource === "health" && method === "GET") {
    return createJsonResponse({ service: "PropSpace AI API", status: "ok" });
  }

  if (resource === "auth") {
    if (identifier === "login" && method === "POST") {
      const payload = parseJsonBody<{ email?: string; password?: string }>(bodyText);
      const email = payload?.email?.trim().toLowerCase();
      const password = payload?.password ?? "";

      if (!email || !password) {
        return createJsonResponse({ detail: "Email and password are required" }, { status: 400 });
      }

      const accounts = getStoredAccounts(request);
      const account = findPasswordAccount(accounts, email);

      if (!account || !account.passwordHash || account.passwordHash !== hashPassword(password)) {
        return createJsonResponse({ detail: "Invalid email or password" }, { status: 401 });
      }

      return respondWithAuth(toAuthUser(account));
    }

    if (identifier === "register" && method === "POST") {
      const payload = parseJsonBody<{ email?: string; name?: string; password?: string; role?: SupportedRole }>(bodyText);
      const email = payload?.email?.trim().toLowerCase();
      const name = payload?.name?.trim();
      const password = payload?.password ?? "";
      const role = payload?.role === "advisor" ? "advisor" : "investor";

      if (!email || !name || !password) {
        return createJsonResponse({ detail: "Name, email, and password are required" }, { status: 400 });
      }

      const passwordError = validatePasswordStrength(password);

      if (passwordError) {
        return createJsonResponse({ detail: passwordError }, { status: 400 });
      }

      const accounts = getStoredAccounts(request);
      const emailExists = email === DEMO_EMAIL || accounts.some((account) => account.email === email);

      if (emailExists) {
        return createJsonResponse({ detail: "An account with this email already exists" }, { status: 409 });
      }

      const nextAccount: StoredAccount = {
        email,
        id: randomUUID(),
        name,
        passwordHash: hashPassword(password),
        provider: "password",
        role,
      };
      const nextAccounts = [...accounts, nextAccount];
      const response = respondWithAuth(toAuthUser(nextAccount));

      setSignedCookie(response, LOCAL_ACCOUNTS_COOKIE_NAME, nextAccounts, 30 * 24 * 60 * 60);
      return response;
    }

    if (identifier === "otp" && subresource === "request" && method === "POST") {
      const payload = parseJsonBody<{ name?: string; phone_number?: string; phoneNumber?: string }>(bodyText);

      try {
        const normalizedPhoneNumber = normalizePhoneNumber(payload?.phone_number ?? payload?.phoneNumber ?? "");
        const now = Date.now();
        const challenges = cleanupOtpChallenges(getStoredOtpChallenges(request));
        const existingChallenge = challenges[normalizedPhoneNumber];

        if (existingChallenge) {
          const resendInSeconds = OTP_RESEND_SECONDS - Math.floor((now - existingChallenge.issuedAt) / 1000);

          if (resendInSeconds > 0) {
            return createJsonResponse(
              { detail: `Please wait ${resendInSeconds} seconds before requesting a new OTP` },
              { status: 400 }
            );
          }
        }

        const otp = randomInt(100000, 1000000).toString();
        const nextChallenges = {
          ...challenges,
          [normalizedPhoneNumber]: {
            attemptsRemaining: 5,
            codeHash: hashOtpCode(normalizedPhoneNumber, otp),
            expiresAt: now + OTP_EXPIRY_SECONDS * 1000,
            issuedAt: now,
            name: payload?.name?.trim() || null,
          },
        } satisfies Record<string, OtpChallenge>;
        const response = createJsonResponse({
          expires_in_seconds: OTP_EXPIRY_SECONDS,
          masked_destination: maskPhoneNumber(normalizedPhoneNumber),
          message: "OTP generated successfully",
          preview_code: otp,
          resend_in_seconds: OTP_RESEND_SECONDS,
        });

        setSignedCookie(response, OTP_COOKIE_NAME, nextChallenges, OTP_EXPIRY_SECONDS);
        return response;
      } catch (error) {
        return createJsonResponse({ detail: error instanceof Error ? error.message : "Unable to request OTP" }, { status: 400 });
      }
    }

    if (identifier === "otp" && subresource === "verify" && method === "POST") {
      const payload = parseJsonBody<{ name?: string; otp?: string; phone_number?: string; phoneNumber?: string }>(bodyText);

      try {
        const normalizedPhoneNumber = normalizePhoneNumber(payload?.phone_number ?? payload?.phoneNumber ?? "");
        const otp = payload?.otp?.trim() ?? "";
        const challenges = cleanupOtpChallenges(getStoredOtpChallenges(request));
        const challenge = challenges[normalizedPhoneNumber];

        if (!challenge) {
          return createJsonResponse({ detail: "OTP has expired or was not requested" }, { status: 400 });
        }

        if (challenge.codeHash !== hashOtpCode(normalizedPhoneNumber, otp)) {
          const remainingAttempts = challenge.attemptsRemaining - 1;
          const nextChallenges = { ...challenges };

          if (remainingAttempts <= 0) {
            delete nextChallenges[normalizedPhoneNumber];
          } else {
            nextChallenges[normalizedPhoneNumber] = {
              ...challenge,
              attemptsRemaining: remainingAttempts,
            };
          }

          const response = createJsonResponse({ detail: "Invalid OTP" }, { status: 400 });
          setSignedCookie(response, OTP_COOKIE_NAME, nextChallenges, OTP_EXPIRY_SECONDS);
          return response;
        }

        const identity = buildPhoneIdentity(normalizedPhoneNumber);
        const accounts = getStoredAccounts(request);
        const existingAccount = accounts.find((account) => account.email === identity.email);
        const nextAccount =
          existingAccount ??
          ({
            email: identity.email,
            id: identity.id,
            name: (payload?.name?.trim() || challenge.name || `Phone User ${normalizedPhoneNumber.slice(-4)}`).trim(),
            phone: normalizedPhoneNumber,
            provider: "otp",
            role: "investor",
          } satisfies StoredAccount);
        const nextAccounts = existingAccount ? accounts : [...accounts, nextAccount];
        const nextChallenges = { ...challenges };
        delete nextChallenges[normalizedPhoneNumber];

        const response = respondWithAuth(toAuthUser(nextAccount));
        setSignedCookie(response, LOCAL_ACCOUNTS_COOKIE_NAME, nextAccounts, 30 * 24 * 60 * 60);
        setSignedCookie(response, OTP_COOKIE_NAME, nextChallenges, OTP_EXPIRY_SECONDS);
        return response;
      } catch (error) {
        return createJsonResponse({ detail: error instanceof Error ? error.message : "Unable to verify OTP" }, { status: 400 });
      }
    }

    if (identifier === "logout" && method === "POST") {
      const response = createJsonResponse({ message: "Logged out successfully" });
      clearCookie(response, SESSION_COOKIE_NAME);
      return response;
    }

    if (identifier === "me" && method === "GET") {
      const session = getSessionPayload(request);

      if (!session) {
        return createJsonResponse({ detail: "Authentication required" }, { status: 401 });
      }

      return createJsonResponse({
        avatar_url: session.avatarUrl ?? null,
        email: session.email,
        id: session.id,
        name: session.name,
        phone: session.phone ?? null,
        provider: session.provider,
        role: session.role,
      });
    }
  }

  if (resource === "properties") {
    if (!identifier && method === "GET") {
      return createJsonResponse(properties);
    }

    if (identifier === "featured" && method === "GET") {
      return createJsonResponse(featuredProperties);
    }

    if (subresource === "emi" && method === "GET") {
      const property = getPropertyBySlug(identifier);

      if (!property) {
        return createJsonResponse({ detail: "Property not found" }, { status: 404 });
      }

      const downPayment = searchParams.get("down_payment");
      const annualInterestRate = searchParams.get("annual_interest_rate");
      const tenureYears = searchParams.get("tenure_years");
      const result = calculateEmi({
        annualInterestRate: annualInterestRate ? Number(annualInterestRate) : 8.5,
        downPayment: downPayment ? Number(downPayment) : Math.round(property.price * 0.2),
        propertyPrice: property.price,
        tenureYears: tenureYears ? Number(tenureYears) : 20,
      });

      return createJsonResponse({
        ...result,
        property_id: property.id,
        source: "api",
      });
    }

    if (identifier && method === "GET") {
      const property = getPropertyBySlug(identifier);

      if (!property) {
        return createJsonResponse({ detail: "Property not found" }, { status: 404 });
      }

      return createJsonResponse(property);
    }
  }

  if (resource === "dashboard" && method === "GET") {
    if (identifier === "overview") {
      return createJsonResponse(dashboardMetrics);
    }

    if (identifier === "market-momentum") {
      return createJsonResponse(marketMomentumSeries);
    }

    if (identifier === "city-allocation") {
      return createJsonResponse(cityAllocationSeries);
    }

    if (identifier === "property-mix") {
      return createJsonResponse(propertyTypeSeries);
    }
  }

  if (resource === "portfolio" && method === "GET") {
    return createJsonResponse(portfolioHoldings);
  }

  if (resource === "alerts" && method === "GET") {
    return createJsonResponse(alertRules);
  }

  if (resource === "reports" && identifier && subresource === "pdf" && method === "GET") {
    const pdfBuffer = buildPropertyPdf(identifier);

    if (!pdfBuffer) {
      return createJsonResponse({ detail: "Property not found" }, { status: 404 });
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${identifier}-report.pdf"`,
        "Content-Type": "application/pdf",
      },
      status: 200,
    });
  }

  if (resource === "ml" && method === "GET") {
    if (identifier === "valuation" && subresource) {
      const metrics = getPropertyMetrics(subresource);

      if (!metrics) {
        return createJsonResponse({ detail: "Property not found" }, { status: 404 });
      }

      return createJsonResponse(metrics);
    }

    if (identifier === "recommendations") {
      const city = searchParams.get("city");
      const limit = Number(searchParams.get("limit") ?? "6");
      const recommendations = (city ? properties.filter((property) => property.city.toLowerCase() === city.toLowerCase()) : properties)
        .sort((left, right) => right.aiInvestmentScore - left.aiInvestmentScore)
        .slice(0, Number.isFinite(limit) ? Math.max(limit, 1) : 6);

      return createJsonResponse(recommendations);
    }

    if (identifier === "commentary" && subresource) {
      const commentary = getPropertyCommentary(subresource);

      if (!commentary) {
        return createJsonResponse({ detail: "Property not found" }, { status: 404 });
      }

      return createJsonResponse(commentary);
    }
  }

  return createJsonResponse({ detail: "Not found" }, { status: 404 });
}
