"use client";

import React from "react";

export function InvoicesSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-1.5 mb-8">
        <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
        <div className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        <div className="h-11 w-full sm:w-44 bg-blue-100/50 dark:bg-blue-900/20 rounded-xl"></div>
      </div>

      {/* Stats/Search Filter Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="h-10 w-full sm:w-64 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl"></div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-10 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl"></div>
          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>

      {/* Desktop Table Container Skeleton */}
      <div className="hidden sm:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-zinc-50/50 dark:bg-zinc-800/50 h-12 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center gap-8">
           {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />)}
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="px-6 py-5 flex items-center justify-between">
              <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div className="h-5 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
              <div className="h-5 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
              <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="flex gap-2">
                 <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                 <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="sm:hidden space-y-4 pb-12">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div className="h-6 w-14 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
              <div className="space-y-2">
                <div className="h-2 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div className="flex gap-1.5">
                <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
