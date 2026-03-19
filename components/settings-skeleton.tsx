"use client";

import React from "react";

export function SettingsSkeleton() {
  const sectionClass = "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm mb-6 animate-pulse";
  const headerClass = "px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center gap-2";
  const itemClass = "px-6 py-4 flex items-center justify-between border-b last:border-0 border-zinc-50 dark:border-zinc-800/50";

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-2xl">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center gap-4 animate-pulse">
        <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 w-10 h-10"></div>
        <div className="space-y-2">
          <div className="h-9 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-4 w-56 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
        </div>
      </div>

      {/* Profile Section Skeleton */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="space-y-2">
            <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
          </div>
        </div>
      </div>

      {/* Subscription Section Skeleton */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 w-8 h-8"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
            </div>
          </div>
          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[5px] bg-zinc-100 dark:bg-zinc-800 w-8 h-8"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section Skeleton */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[5px] bg-zinc-100 dark:bg-zinc-800 w-8 h-8"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3 w-40 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[5px] bg-zinc-100 dark:bg-zinc-800 w-8 h-8"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3 w-36 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-32 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    </div>
  );
}
