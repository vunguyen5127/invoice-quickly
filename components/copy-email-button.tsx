"use client";

import React, { useState } from "react";
import { Mail, Copy, CheckCircle2 } from "lucide-react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopyEmail}
      className="inline-flex items-center gap-3 rounded-[5px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-6 py-4 font-bold border-2 border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all group relative"
    >
      <Mail className="w-5 h-5" />
      <span>{email}</span>
      {copied ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-200" />
      ) : (
        <Copy className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
      )}
      {copied && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs rounded-[5px] shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Copied!
        </span>
      )}
    </button>
  );
}
