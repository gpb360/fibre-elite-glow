import assert from 'node:assert/strict';
import test from 'node:test';

process.env.ADMIN_SESSION_SECRET = 'unit-test-session-secret';

const {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionValue,
  getDiagnosticAccessFailureStatus,
  hasAdminSessionSecretConfigured,
  verifyAdminRequest,
  verifyAdminSessionValue,
} = await import('../src/lib/admin-auth.ts');

test('signed sessions expire and reject timestamps from the future', () => {
  assert.equal(verifyAdminSessionValue(createAdminSessionValue()), true);

  const expiredAt = Date.now() - ADMIN_SESSION_MAX_AGE_SECONDS * 1000 - 1;
  assert.equal(verifyAdminSessionValue(createAdminSessionValue(expiredAt)), false);

  const futureAt = Date.now() + 61_000;
  assert.equal(verifyAdminSessionValue(createAdminSessionValue(futureAt)), false);
});

test('production fails closed without a dedicated session secret', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSessionSecret = process.env.ADMIN_SESSION_SECRET;
  const originalPassword = process.env.ADMIN_PASSWORD;

  try {
    process.env.NODE_ENV = 'production';
    delete process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_PASSWORD = 'password-must-not-sign-sessions';

    assert.equal(hasAdminSessionSecretConfigured(), false);
    assert.throws(
      () => createAdminSessionValue(),
      /Missing admin session secret/
    );
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;

    if (originalSessionSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSessionSecret;

    if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = originalPassword;
  }
});

test('a forged admin header cannot replace the signed cookie', () => {
  const forged = new Request('https://example.test/api/admin/orders', {
    headers: { 'x-admin-auth': 'true' },
  });
  assert.equal(verifyAdminRequest(forged), false);

  const malformed = new Request('https://example.test/api/admin/orders', {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=%` },
  });
  assert.equal(verifyAdminRequest(malformed), false);

  const signed = new Request('https://example.test/api/admin/orders', {
    headers: {
      cookie: `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(createAdminSessionValue())}`,
    },
  });
  assert.equal(verifyAdminRequest(signed), true);
});

test('diagnostic endpoints are hidden in production and session-gated in development', () => {
  const unsigned = new Request('https://example.test/api/webhook-test');
  assert.equal(getDiagnosticAccessFailureStatus(unsigned, 'production'), 404);
  assert.equal(getDiagnosticAccessFailureStatus(unsigned, 'development'), 401);

  const signed = new Request('https://example.test/api/webhook-test', {
    headers: {
      cookie: `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(createAdminSessionValue())}`,
    },
  });
  assert.equal(getDiagnosticAccessFailureStatus(signed, 'production'), 404);
  assert.equal(getDiagnosticAccessFailureStatus(signed, 'development'), null);
});
