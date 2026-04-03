"use client";

import React from "react";

export function InvoiceEditSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 animate-pulse">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl h-14">
        <div className="container flex h-full items-center justify-between px-4 sm:px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            <div className="h-5 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
             <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
             <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-8 max-w-[1600px] flex-1">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column: Form Skeleton */}
          <div className="w-full xl:w-1/2 space-y-6">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[5px] h-[700px] p-8 space-y-8 shadow-sm">
               <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-xl"></div>
               <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-xl"></div>
               <div className="h-64 w-full bg-zinc-50 dark:bg-zinc-800/30 rounded-xl"></div>
            </div>
          </div>

          {/* Right Column: Preview Skeleton */}
          <div className="w-full xl:w-1/2 space-y-6">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-[5px] h-[800px] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-8">
               <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[5px] shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
