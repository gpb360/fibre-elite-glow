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
