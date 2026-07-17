"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
  } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-zinc-400">Loading your data...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse"></div>
              <div className="mt-3 h-8 w-16 rounded bg-zinc-800 animate-pulse"></div>
              <div className="mt-2 h-4 w-32 rounded bg-zinc-800 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Welcome 👋. Here&apos;s an overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Contacts"
          value={String(data.total_contacts)}
          subtitle="Total contacts"
        />

        <StatCard
          title="Campaigns"
          value={String(data.total_campaigns)}
          subtitle="Campaigns created"
        />

        <StatCard
          title="Emails Sent"
          value={String(data.emails_sent)}
          subtitle="Emails delivered"
        />

        <StatCard
          title="Open Rate"
          value={`${data.open_rate}%`}
          subtitle="Average open rate"
        />

      </div>

    </div>
  );
}