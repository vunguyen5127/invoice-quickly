"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const [lang, setLang] = useState("EN");

  const toggleLang = () => {
    setLang(lang === "EN" ? "VN" : "EN");
    alert("Language switching coming soon!");
  };

  return (
    <button
      onClick={toggleLang}
      className="inline-flex items-center justify-center rounded-full p-2 h-9 w-9 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle language"
      title="Toggle language"
    >
      <Globe className="w-5 h-5" />
      <span className="sr-only">Toggle language</span>
    </button>
  );
}
