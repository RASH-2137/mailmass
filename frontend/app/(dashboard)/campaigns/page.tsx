"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignTable } from "@/components/campaigns/campaign-table";
import { AddCampaignDialog } from "@/components/campaigns/add-campaign-dialog";
import { CampaignToastProvider } from "@/components/campaigns/campaign-toast";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoading } from "@/components/shared/table-loading";

export default function CampaignsPage() {
  const {
    campaigns,
    loading,
    error,
    reloadCampaigns,
  } = useCampaigns();

  const showEmptyState = !loading && !error && campaigns.length === 0;

  return (
    <CampaignToastProvider>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Campaigns</h1>
            <p className="mt-2 text-zinc-400">
              {campaigns.length} total campaigns
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AddCampaignDialog onCampaignCreated={reloadCampaigns} />
          </div>
        </div>

        {loading ? (
          <TableLoading />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : showEmptyState ? (
          <EmptyState 
            title="No campaigns yet"
            description="Create your first email campaign to start sending messages."
          />
        ) : (
          <CampaignTable
            campaigns={campaigns}
            onCampaignChanged={reloadCampaigns}
          />
        )}
      </div>
    </CampaignToastProvider>
  );
}