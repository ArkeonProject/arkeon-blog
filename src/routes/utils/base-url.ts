const DEFAULT_BASE_URL = "http://localhost:5173";

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

function withDefaultProtocol(value: string): string {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
}

function parseHttpOrigin(value: string): string | null {
  try {
    const parsed = new URL(withDefaultProtocol(value.trim()));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    if (!isAllowedHost(parsed.hostname)) {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

function getVercelBaseUrl(): string | null {
  for (const vercelUrl of [process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]) {
    if (!vercelUrl) {
      continue;
    }

    const parsedOrigin = parseHttpOrigin(vercelUrl);
    if (parsedOrigin) {
      return parsedOrigin;
    }
  }

  return null;
}

function isAllowedHost(hostname: string): boolean {
  const normalizedHost = hostname.toLowerCase();
  if (normalizedHost === "arkeonixlabs.com" || normalizedHost === "www.arkeonixlabs.com") {
    return true;
  }

  if (normalizedHost.endsWith(".vercel.app")) {
    return true;
  }

  if (!isProductionRuntime()) {
    return normalizedHost === "localhost" || normalizedHost === "127.0.0.1" || normalizedHost === "0.0.0.0";
  }

  return false;
}

export function getBaseUrl(): string {
  const rawBaseUrl = process.env.BASE_URL?.trim();
  const candidate = rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl : undefined;

  if (candidate) {
    const parsedOrigin = parseHttpOrigin(candidate);
    if (parsedOrigin) {
      return parsedOrigin;
    }

    const vercelBaseUrl = getVercelBaseUrl();
    if (vercelBaseUrl) {
      console.error("Invalid BASE_URL; falling back to Vercel URL");
      return vercelBaseUrl;
    }

    if (isProductionRuntime()) {
      throw new Error("Invalid BASE_URL in production runtime");
    }

    console.error("Invalid BASE_URL; falling back to localhost");
    return DEFAULT_BASE_URL;
  }

  const vercelBaseUrl = getVercelBaseUrl();
  if (vercelBaseUrl) {
    return vercelBaseUrl;
  }

  if (isProductionRuntime()) {
    throw new Error("Missing BASE_URL in production runtime");
  }

  return DEFAULT_BASE_URL;
}
