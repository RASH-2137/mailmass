"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { CampaignsLoading } from "@/components/campaigns/campaigns-loading";
import { EmptyState } from "@/components/campaigns/empty-state";

export default function AnalyticsPage() {
  const { campaigns, loading: campaignsLoading, error: campaignsError } = useCampaigns();
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();

  const loading = campaignsLoading || statsLoading;
  const error = campaignsError || statsError;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-zinc-400">Loading campaign performance data...</p>
        </div>
        <CampaignsLoading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-10 px-6 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-zinc-400">Overview of your campaign performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Campaigns" value={stats.total_campaigns} />
        <SummaryCard title="Emails Sent" value={stats.emails_sent} />
        <SummaryCard title="Open Rate" value={`${stats.open_rate}%`} />
        <SummaryCard title="Click Rate" value={`${stats.click_rate}%`} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Campaign Analytics</h2>
        {campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/50">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium text-right">Recipients</th>
                  <th className="px-6 py-4 font-medium text-right">Sent</th>
                  <th className="px-6 py-4 font-medium text-right">Delivered</th>
                  <th className="px-6 py-4 font-medium text-right">Opened</th>
                  <th className="px-6 py-4 font-medium text-right">Clicked</th>
                  <th className="px-6 py-4 font-medium text-right">Open Rate</th>
                  <th className="px-6 py-4 font-medium text-right">Click Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="transition-colors hover:bg-zinc-800/40">
                    <td className="px-6 py-4 text-white font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.recipients_count}</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.emails_sent}</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.emails_sent}</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.opens || 0}</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.clicks || 0}</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.open_rate || 0}%</td>
                    <td className="px-6 py-4 text-zinc-400 text-right">{campaign.click_rate || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-6 flex flex-col justify-center">
      <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
    </div>
  );
}