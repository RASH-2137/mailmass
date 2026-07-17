"use client";

import { useProfile } from "@/hooks/useProfile";

export function AccountSection() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Account</h2>
        <div className="animate-pulse space-y-4 max-w-md">
          <div className="h-10 bg-zinc-800 rounded-md w-full" />
          <div className="h-10 bg-zinc-800 rounded-md w-full" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Account</h2>
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
          Failed to load profile data.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Account</h2>
      
      <div className="max-w-md space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Name</label>
          <input
            type="text"
            value={profile.name}
            readOnly
            className="w-full rounded-md border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed focus:outline-none"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Email Address</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full rounded-md border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed focus:outline-none"
          />
        </div>
        
        <p className="text-xs text-zinc-400">
          * Profile editing is managed by the administrator.
        </p>
      </div>
    </div>
  );
}
