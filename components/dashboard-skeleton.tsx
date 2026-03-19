"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4 sm:mb-12">
        <div className="space-y-3">
          <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
        </div>
        <div className="hidden sm:block h-11 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden sm:block overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="bg-zinc-50/50 dark:bg-zinc-800/50 h-14 border-b border-zinc-200 dark:border-zinc-800" />
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-3 w-56 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-20">
                <div className="h-6 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                  <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="sm:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                <div className="space-y-2">
                   <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                   <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-1">
                 <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl" />
                 <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl" />
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
               <div className="space-y-1">
                  <div className="h-2 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-5 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
               </div>
               <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
