import config from "@/utils/config";

/**
 * Gets the base URL for the application.
 * Prioritizes actual browser origin on the client to ensure reliability across environments.
 * Falls back to config.siteUrl for server-side usage.
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

  // 3. Last resort: local development fallback
  const fallback = "http://localhost:3000";
  return fallback;
};
