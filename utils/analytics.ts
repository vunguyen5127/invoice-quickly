/**
 * Central analytics helper.
 * Wraps window.gtag so callers don't need to worry about SSR or missing gtag.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Send a custom GA4 event.
 * Safe to call on server — silently no-ops when gtag is not available.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch {
    // Never crash the UI over a tracking failure
  }
}

/**
 * Track a PDF download event in GA4.
 * @param docType  "invoice" | "quote"
 * @param docNumber  The invoice/quote number shown to the user
 */
export function trackPdfDownload(
  docType: "invoice" | "quote",
  docNumber?: string
) {
  trackEvent("pdf_download", {
    event_category: "engagement",
    document_type: docType,
    document_number: docNumber ?? "unknown",
  });
}
