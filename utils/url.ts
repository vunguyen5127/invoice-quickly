import { SITE_URL } from "@/utils/config";

export const getBaseUrl = () => {
  // 1. Prefer explicitly defined site URL
  if (SITE_URL) {
    let url = SITE_URL;
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
