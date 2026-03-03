"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en, Translations } from "@/locales/en";
import { vn } from "@/locales/vn";

type LanguageCode = "EN" | "VN" | string; // Allow other strings but only provide full translations for EN/VN right now

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: Translations;
}

const dictionaries: Record<string, Translations> = {
  EN: en,
  VN: vn,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>("EN");
  const [mounted, setMounted] = useState(false);

  // Load saved language from local storage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("iq_language");
    if (saved) {
      setLang(saved);
    }
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
