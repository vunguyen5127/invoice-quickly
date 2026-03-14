"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Tooltip } from "./tooltip";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Tooltip content={theme === "light" ? "Dark Mode" : "Light Mode"} position="bottom">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="inline-flex items-center justify-center rounded-[5px] h-9 w-9 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-all text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
        <span className="sr-only">Toggle theme</span>
      </button>
    </Tooltip>
  );
}

import { useLanguage } from "@/contexts/language-context";
import { Monitor } from "lucide-react";

export function ThemeSelector() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { id: 'light', label: t.light, icon: Sun },
    { id: 'system', label: t.system, icon: Monitor },
    { id: 'dark', label: t.dark, icon: Moon },
  ];

  return (
    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-[5px] border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto self-center lg:self-start">
      {themes.map((item) => {
        const Icon = item.icon;
        const isActive = theme === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setTheme(item.id)}
            className={`
              flex flex-1 items-center justify-center gap-2 px-3 py-2 rounded-[5px] text-sm font-semibold transition-all duration-200
              ${isActive 
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }
            `}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
