"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Label } from "@/components/ui/label";

export function PreferencesSection() {
  const [pageSize, setPageSize] = useLocalStorage<number>("mailmass_page_size", 10);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">Preferences</h2>
        <p className="text-sm text-muted-foreground">Customize your application experience.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Default Page Size</Label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={10}>10 items per page</option>
              <option value={20}>20 items per page</option>
              <option value={50}>50 items per page</option>
              <option value={100}>100 items per page</option>
            </select>
            <p className="text-[0.8rem] text-muted-foreground">
              The number of items to display per page across the application.
            </p>
          </div>
        </div>
        <div className="bg-muted/30 px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">This preference is saved locally to your browser.</p>
        </div>
      </div>
    </div>
  );
}
