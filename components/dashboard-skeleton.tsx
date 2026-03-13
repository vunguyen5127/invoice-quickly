"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-3">
          <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
        </div>
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-[220px] flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-zinc-100 dark:bg-zinc-800 rounded-[5px]"></div>
                <div className="h-9 w-9 bg-zinc-100 dark:bg-zinc-800 rounded-[5px]"></div>
              </div>
            </div>
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-[5px] mb-2"></div>
            <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
            
            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-end">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                <div className="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
