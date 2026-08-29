import { createHmac, createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "kwako_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

function requiredEnv(name: "ADMIN_USERNAME" | "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for admin authentication`);
  if (name === "ADMIN_SESSION_SECRET" && value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  }
  return value;
}

function safeEqual(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

function signature(payload: string) {
  return createHmac("sha256", requiredEnv("ADMIN_SESSION_SECRET"))
    .update(payload)
    .digest("base64url");
}

export function validateAdminCredentials(username: string, password: string) {
  return (
    safeEqual(username, requiredEnv("ADMIN_USERNAME")) &&
    safeEqual(password, requiredEnv("ADMIN_PASSWORD"))
  );
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({ username: requiredEnv("ADMIN_USERNAME"), expiresAt }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminSession(token: string | undefined) {
  if (!token) return false;
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return false;
  if (!safeEqual(suppliedSignature, signature(payload))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: unknown;
      expiresAt?: unknown;
    };
    return (
      session.username === requiredEnv("ADMIN_USERNAME") &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

export function expiredSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}

export async function isAdminAuthenticated() {
  return verifyAdminSession((await cookies()).get(COOKIE_NAME)?.value);
}

export function isAdminRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return verifyAdminSession(token ? decodeURIComponent(token) : undefined);
}
