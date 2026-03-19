import config from "@/utils/config";

/**
 * Gets the base URL for the application.
 * Prioritizes actual browser origin on the client to ensure reliability across environments.
 * Falls back to config.siteUrl or NEXT_PUBLIC_VERCEL_URL for server-side usage.
 */
export const getBaseUrl = () => {
  // 1. Client-side: Always trust the current origin
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  // 2. Server-side: Prefer config.siteUrl if it's set to a production domain
  if (config.siteUrl && config.siteUrl !== "http://localhost:3000") {
    const url = config.siteUrl.includes("http") ? config.siteUrl : `https://${config.siteUrl}`;
    return url.replace(/\/$/, "");
  }

  // 3. Last resort: Vercel environment or local development fallback
  const fallback = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
  const url = fallback.includes("http") ? fallback : `https://${fallback}`;
  return url.replace(/\/$/, "");
};
