"use client";

import React from "react";

export function InvoiceViewSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-2 w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
            <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="h-10 flex-1 sm:w-24 bg-zinc-100 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="h-10 flex-1 sm:w-24 bg-zinc-100 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="h-10 flex-1 sm:w-32 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
        </div>
      </div>

      {/* Large Preview Skeleton */}
      <div className="w-full h-[800px] bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col p-8">
        <div className="flex justify-between mb-12">
          <div className="w-32 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="w-48 h-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
        </div>
        <div className="space-y-6">
          <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
          <div className="h-[400px] w-full bg-zinc-50 dark:bg-zinc-800/30 rounded-[5px]"></div>
          <div className="flex justify-end pt-6">
             <div className="w-64 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
