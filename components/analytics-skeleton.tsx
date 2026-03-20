import React from "react";

export function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-8 py-10 max-w-7xl">
        
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-pulse">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-3">
              <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-5 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-8 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 h-[450px] flex flex-col gap-8 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl" />
          </div>

          {/* Side Chart */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 h-[450px] flex flex-col gap-8 animate-pulse">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl" />
            <div className="space-y-3 pt-6 border-t border-zinc-100 dark:border-white/5">
              <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
