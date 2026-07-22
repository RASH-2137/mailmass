"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { TableLoading } from "@/components/shared/table-loading";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3, LineChart, TrendingUp, Mail, MousePointerClick, CheckCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { campaigns, loading: campaignsLoading, error: campaignsError } = useCampaigns();
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();

  const loading = campaignsLoading || statsLoading;
  const error = campaignsError || statsError;

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2 text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Loading campaign performance data...</p>
        </div>
        <TableLoading />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load analytics"
        description={error}
      />
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Overview of your campaign performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard 
          icon={Mail} 
          title="Total Campaigns" 
          value={stats.total_campaigns} 
        />
        <SummaryCard 
          icon={CheckCircle} 
          title="Emails Sent" 
          value={stats.emails_sent} 
        />
        <SummaryCard 
          icon={TrendingUp} 
          title="Open Rate" 
          value={`${stats.open_rate}%`} 
        />
        <SummaryCard 
          icon={MousePointerClick} 
          title="Click Rate" 
          value={`${stats.click_rate}%`} 
        />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <LineChart className="size-5" />
          <h2 className="text-lg font-semibold">Recent Campaign Performance</h2>
        </div>
        
        {campaigns.length === 0 ? (
          <EmptyState 
            icon={BarChart3}
            title="No campaign analytics"
            description="Create and send your first email campaign to see performance data."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-border bg-muted/30 text-xs font-medium uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4 text-right">Recipients</th>
                  <th className="px-6 py-4 text-right">Sent</th>
                  <th className="px-6 py-4 text-right">Delivered</th>
                  <th className="px-6 py-4 text-right">Opened</th>
                  <th className="px-6 py-4 text-right">Clicked</th>
                  <th className="px-6 py-4 text-right">Open Rate</th>
                  <th className="px-6 py-4 text-right">Click Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-6 py-4 text-foreground font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">{campaign.recipients_count}</td>
                    <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">{campaign.emails_sent}</td>
                    <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">{campaign.emails_sent}</td>
                    <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">{campaign.opens || 0}</td>
                    <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">{campaign.clicks || 0}</td>
                    <td className="px-6 py-4 text-foreground font-medium text-right tabular-nums">{campaign.open_rate || 0}%</td>
                    <td className="px-6 py-4 text-foreground font-medium text-right tabular-nums">{campaign.click_rate || 0}%</td>
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

function SummaryCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  );
}