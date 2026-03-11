/**
 * Returns the base URL for the application.
 * In a browser environment, it uses the current window's origin.
 * It can also be overridden by NEXT_PUBLIC_SITE_URL environment variable.
 */
export const getBaseUrl = () => {
  // 1. Prefer explicitly defined site URL
  if (process?.env?.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL;
    url = url.includes("http") ? url : `https://${url}`;
    return url.replace(/\/$/, "");
  }

  // 2. Fallback to window.location.origin in client environment
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 3. Fallback to Vercel URL or localhost for SSR/Edge
  let fallbackUrl = process?.env?.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000";
  fallbackUrl = fallbackUrl.includes("http") ? fallbackUrl : `https://${fallbackUrl}`;
  return fallbackUrl.replace(/\/$/, "");
};
