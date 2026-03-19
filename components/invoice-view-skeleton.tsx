"use client";

import React from "react";

export function InvoiceViewSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl animate-pulse">
      {/* Breadcrumb/Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
             <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
             <div className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
             <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
             <div className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
             <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
             <div className="h-5 w-14 bg-blue-100/50 dark:bg-blue-900/30 rounded-full ml-1"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-10 w-32 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-xl"></div>
          <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>

      {/* Large Preview Skeleton */}
      <div className="w-full h-[850px] bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[5px] shadow-sm flex flex-col p-10 mt-2">
        <div className="flex justify-between mb-16">
          <div className="w-40 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          <div className="w-56 h-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
        </div>
        <div className="space-y-8 flex-1">
          <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-lg"></div>
          <div className="h-[450px] w-full bg-zinc-50 dark:bg-zinc-800/20 rounded-lg"></div>
          <div className="flex justify-end pt-8">
             <div className="w-72 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
