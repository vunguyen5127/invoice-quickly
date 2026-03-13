"use client";

import React from "react";

export function InvoicesSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px] mb-6"></div>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
        </div>
        <div className="h-10 w-full sm:w-40 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[5px] overflow-hidden">
        {/* Table Header with search */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div>
          <div className="h-9 w-full sm:w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>

        {/* Table Content Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  <td className="px-6 py-4"><div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-[5px]"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded-[5px]"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-[5px] ml-auto"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-md ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
