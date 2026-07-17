"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export function PreferencesSection() {
  const [pageSize, setPageSize] = useLocalStorage<number>("mailmass_page_size", 10);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Preferences</h2>
      
      <div className="max-w-md">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-300">Default Page Size</h3>
            <p className="text-sm text-zinc-400 mt-1">
              The number of items to display per page across the application.
            </p>
          </div>
          
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
          >
            <option value={10}>10 items per page</option>
            <option value={20}>20 items per page</option>
            <option value={50}>50 items per page</option>
            <option value={100}>100 items per page</option>
          </select>
          
          <p className="text-xs text-zinc-500">
            * This preference is saved locally to this browser.
          </p>
        </div>
      </div>
    </div>
  );
}
