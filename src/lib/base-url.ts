function normalizeUrl(value?: string): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return null;
  }
}

function getRequestOrigin(requestUrl?: string): string | null {
  if (!requestUrl) return null;

  try {
    return new URL(requestUrl).origin;
  } catch {
    return null;
  }
}

function isLocalUrl(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch {
    return false;
  }
}

function getConfiguredCheckoutHosts(): Set<string> {
  const values = (process.env.CHECKOUT_ALLOWED_HOSTS || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
  return new Set(values);
}

function isAllowedCheckoutOrigin(value: string, allowedHosts: Set<string>): boolean {
  try {
    return allowedHosts.has(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Resolve Stripe return URLs from deployment-owned configuration only.
 * A raw request Host is never trusted unless it is explicitly allowlisted.
 */
export function getCheckoutBaseUrl(requestUrl?: string): string {
  if (process.env.NODE_ENV === 'development') {
    const requestOrigin = getRequestOrigin(requestUrl);
    if (requestOrigin && isLocalUrl(requestOrigin)) return requestOrigin;
    return normalizeUrl(process.env.NEXT_PUBLIC_APP_URL) || 'http://localhost:3000';
  }

  const explicitCheckoutUrl =
    normalizeUrl(process.env.CHECKOUT_BASE_URL) ||
    normalizeUrl(process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL);
  if (explicitCheckoutUrl) return explicitCheckoutUrl;

  const vercelProjectUrl = normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProjectUrl) return vercelProjectUrl;

  const vercelDeploymentUrl = normalizeUrl(process.env.VERCEL_URL);
  if (vercelDeploymentUrl) return vercelDeploymentUrl;

  const allowedHosts = getConfiguredCheckoutHosts();
  const requestOrigin = getRequestOrigin(requestUrl);
  if (requestOrigin && isAllowedCheckoutOrigin(requestOrigin, allowedHosts)) {
    return requestOrigin;
  }

  const legacyConfiguredUrl = normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL);
  if (legacyConfiguredUrl && isAllowedCheckoutOrigin(legacyConfiguredUrl, allowedHosts)) {
    return legacyConfiguredUrl;
  }

  return 'https://fibre-elite-glow.vercel.app';
}

export function getDeploymentBaseUrl(requestUrl?: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const requestOrigin = getRequestOrigin(requestUrl);
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

  const candidates = isDevelopment
    ? [
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.NEXT_PUBLIC_BASE_URL,
        requestOrigin,
        'http://localhost:3000',
      ]
    : [
        process.env.NEXT_PUBLIC_BASE_URL,
        vercelUrl,
        requestOrigin,
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.URL,
        'https://lbve.ca',
      ];

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (!normalized) continue;
    if (!isDevelopment && isLocalUrl(normalized)) continue;
    return normalized;
  }

  return isDevelopment ? 'http://localhost:3000' : 'https://lbve.ca';
}
