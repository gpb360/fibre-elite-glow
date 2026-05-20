import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'lbve_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

function getAdminPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD || process.env.ADMIN_DASHBOARD_PASSWORD;

  if (password) return password;

  if (process.env.NODE_ENV !== 'production') {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'lbve-admin-2024';
  }

  return undefined;
}

function getSessionSecret(): string | undefined {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_DASHBOARD_PASSWORD ||
    process.env.ADMIN_API_KEY;

  if (secret) return secret;

  if (process.env.NODE_ENV !== 'production') {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'lbve-admin-local-session';
  }

  return undefined;
}

function signSession(timestamp: string): string | undefined {
  const secret = getSessionSecret();
  if (!secret) return undefined;

  return createHmac('sha256', secret).update(timestamp).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;

  return timingSafeEqual(aBuffer, bBuffer);
}

function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find(item => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

export function hasAdminPasswordConfigured(): boolean {
  return !!getAdminPassword();
}

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = getAdminPassword();
  if (!expectedPassword) return false;

  return safeEqual(password, expectedPassword);
}

export function createAdminSessionValue(now = Date.now()): string {
  const timestamp = String(now);
  const signature = signSession(timestamp);

  if (!signature) {
    throw new Error('Missing admin session secret');
  }

  return `${timestamp}.${signature}`;
}

export function verifyAdminSessionValue(value: string | null): boolean {
  if (!value) return false;

  const [timestamp, signature] = value.split('.');
  if (!timestamp || !signature) return false;

  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;

  const expiresAt = issuedAt + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  if (Date.now() > expiresAt) return false;

  const expectedSignature = signSession(timestamp);
  if (!expectedSignature) return false;

  return safeEqual(signature, expectedSignature);
}

export function verifyAdminRequest(request: Request): boolean {
  return verifyAdminSessionValue(getCookieValue(request, ADMIN_SESSION_COOKIE));
}
