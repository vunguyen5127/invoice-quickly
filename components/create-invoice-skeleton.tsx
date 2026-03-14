"use client";

import React from "react";

export function CreateInvoiceSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-[#f6f6f6] dark:bg-zinc-950/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-12 items-center justify-between px-4 sm:px-8 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-[5px] hidden sm:block"></div>
            <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-full ml-1"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg hidden sm:block"></div>
            <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg hidden sm:block"></div>
            <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-8 py-8 max-w-[1600px] flex-1">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
          <div className="h-3 w-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-full"></div>
          <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
          <div className="h-3 w-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-full"></div>
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-start gap-8 pb-32 xl:pb-20">
          {/* Left Column: Form Skeleton */}
          <div className="w-full xl:w-1/2 flex flex-col gap-6">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
            <div className="bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 space-y-8">
              {/* Form sections */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
              </div>
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 flex-1 bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                    <div className="h-10 w-20 bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                    <div className="h-10 w-24 bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Preview Skeleton */}
          <div className="w-full xl:w-1/2">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-[5px] mb-6"></div>
            <div className="aspect-[1/1.41] w-full bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
               <div className="flex justify-between">
                  <div className="h-12 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
                  <div className="h-14 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
               </div>
               <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-3">
                     <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                     <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                  </div>
                  <div className="space-y-3">
                     <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                     <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                  </div>
               </div>
               <div className="mt-12 space-y-4">
                  <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                  <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
                  <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-[5px]"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
