"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en, Translations } from "@/locales/en";
import { vn } from "@/locales/vn";
import { ar } from "@/locales/ar";
import { zh } from "@/locales/zh";
import { da } from "@/locales/da";
import { nl } from "@/locales/nl";
import { fi } from "@/locales/fi";
import { fr } from "@/locales/fr";
import { de } from "@/locales/de";
import { hi } from "@/locales/hi";
import { id } from "@/locales/id";
import { it } from "@/locales/it";
import { ja } from "@/locales/ja";
import { ko } from "@/locales/ko";
import { no } from "@/locales/no";
import { pl } from "@/locales/pl";
import { pt } from "@/locales/pt";
import { ru } from "@/locales/ru";
import { es } from "@/locales/es";
import { sv } from "@/locales/sv";
import { th } from "@/locales/th";
import { tr } from "@/locales/tr";

type LanguageCode = 
  | "EN" | "VN" | "AR" | "ZH" | "DA" | "NL" | "FI" | "FR" | "DE" | "HI" 
  | "ID" | "IT" | "JA" | "KO" | "NO" | "PL" | "PT" | "RU" | "ES" | "SV" 
  | "TH" | "TR";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: Translations;
}

const dictionaries: Record<string, Translations> = {
  EN: en,
  VN: vn,
  AR: ar,
  ZH: zh,
  DA: da,
  NL: nl,
  FI: fi,
  FR: fr,
  DE: de,
  HI: hi,
  ID: id,
  IT: it,
  JA: ja,
  KO: ko,
  NO: no,
  PL: pl,
  PT: pt,
  RU: ru,
  ES: es,
  SV: sv,
  TH: th,
  TR: tr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>("EN");
  const [mounted, setMounted] = useState(false);

  // Load saved language from local storage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("iq_language");
      setLang(saved as LanguageCode);
  }, []);

  const handleSetLang = (code: LanguageCode) => {
    setLang(code);
    localStorage.setItem("iq_language", code);
  };

  // Fallback to English if translation is missing
  const t = dictionaries[lang] || en;

  // Prevent hydration mismatch by rendering default on server, then updating client
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: "EN", setLang: handleSetLang, t: en }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
