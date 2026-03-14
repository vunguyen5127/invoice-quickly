"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Tooltip } from "./tooltip";

export const languages = [
  { code: "EN", name: "English" },
  { code: "AR", name: "العربية" },
  { code: "ZH", name: "中文 (Chinese)" },
  { code: "DA", name: "Dansk" },
  { code: "NL", name: "Nederlands" },
  { code: "FI", name: "Suomi" },
  { code: "FR", name: "Français" },
  { code: "DE", name: "Deutsch" },
  { code: "HI", name: "हिन्दी (Hindi)" },
  { code: "ID", name: "Bahasa Indonesia" },
  { code: "IT", name: "Italiano" },
  { code: "JA", name: "日本語 (Japanese)" },
  { code: "KO", name: "한국어 (Korean)" },
  { code: "NO", name: "Norsk" },
  { code: "PL", name: "Polski" },
  { code: "PT", name: "Português" },
  { code: "RU", name: "Русский" },
  { code: "ES", name: "Español" },
  { code: "SV", name: "Svenska" },
  { code: "TH", name: "ไทย (Thai)" },
  { code: "TR", name: "Türkçe" },
  { code: "VN", name: "Tiếng Việt" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLang = (code: string) => {
    setLang(code as any);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content="Select language" position="bottom">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden sm:inline-flex items-center justify-center rounded-[5px] p-2 h-9 w-9 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select language"
          aria-expanded={isOpen}
        >
          <Globe className="w-5 h-5" />
          <span className="sr-only">Select language</span>
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-[5px] bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="py-1 flex flex-col max-h-80 overflow-y-auto custom-scrollbar">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => selectLang(l.code)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                  lang === l.code 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium" 
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{l.name}</span>
                {lang === l.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
