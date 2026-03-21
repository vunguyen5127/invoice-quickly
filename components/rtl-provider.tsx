"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";

// Languages that require RTL layout
const RTL_LOCALES = new Set(["AR"]);

// Map language code to BCP 47 lang tag
const LANG_MAP: Record<string, string> = {
  EN: "en", VN: "vi", AR: "ar", ZH: "zh", DA: "da",
  NL: "nl", FI: "fi", FR: "fr", DE: "de", HI: "hi",
  ID: "id", IT: "it", JA: "ja", KO: "ko", NO: "no",
  PL: "pl", PT: "pt", RU: "ru", ES: "es", SV: "sv",
  TH: "th", TR: "tr",
};

/**
 * Syncs the <html> element's `dir` and `lang` attributes
 * with the currently selected language. Enables RTL layout for Arabic.
 */
export function RtlProvider() {
  const { lang } = useLanguage();

  useEffect(() => {
    const html = document.documentElement;
    const isRtl = RTL_LOCALES.has(lang);

    html.setAttribute("dir", isRtl ? "rtl" : "ltr");
    html.setAttribute("lang", LANG_MAP[lang] ?? "en");
  }, [lang]);

  return null;
}
