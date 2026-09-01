import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionValue,
  hasAdminPasswordConfigured,
  hasAdminSessionSecretConfigured,
  verifyAdminPassword,
  verifyAdminRequest,
} from '@/lib/admin-auth';

const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_LOGIN_MAX_FAILURES = 5;
const loginFailures = new Map<string, { count: number; windowStartedAt: number }>();

function loginClientId(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isLoginRateLimited(clientId: string, now = Date.now()): boolean {
  const attempt = loginFailures.get(clientId);
  if (!attempt) return false;
  if (now - attempt.windowStartedAt >= ADMIN_LOGIN_WINDOW_MS) {
    loginFailures.delete(clientId);
    return false;
  }
  return attempt.count >= ADMIN_LOGIN_MAX_FAILURES;
}

function recordLoginFailure(clientId: string, now = Date.now()): void {
  const existing = loginFailures.get(clientId);
  if (!existing || now - existing.windowStartedAt >= ADMIN_LOGIN_WINDOW_MS) {
    loginFailures.set(clientId, { count: 1, windowStartedAt: now });
    return;
  }
  existing.count += 1;
}

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: verifyAdminRequest(request) });
}

export async function POST(request: Request) {
  if (!hasAdminPasswordConfigured() || !hasAdminSessionSecretConfigured()) {
    return NextResponse.json(
      { error: 'Admin password is not configured' },
      { status: 503 }
    );
  }

  const clientId = loginClientId(request);
  if (isLoginRateLimited(clientId)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(ADMIN_LOGIN_WINDOW_MS / 1000) } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password : '';

  if (!verifyAdminPassword(password)) {
    recordLoginFailure(clientId);
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  loginFailures.delete(clientId);

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
