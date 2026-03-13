"use client";

import React from "react";
import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import type { PlanType } from "@/types/subscription";

interface PlanBadgeProps {
  plan: PlanType;
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  if (plan === "pro") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-400/20 dark:from-yellow-500/15 dark:to-amber-500/15 text-yellow-700 dark:text-yellow-400 text-[11px] font-bold uppercase tracking-wider border border-yellow-300/30 dark:border-yellow-600/20">
        <Crown className="w-3 h-3" />
        Pro
      </span>
    );
  }

  return (
    <Link
      href="/pricing"
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
      title="Upgrade to Pro"
    >
      <Sparkles className="w-3 h-3" />
      Free · Upgrade
    </Link>
  );
}
