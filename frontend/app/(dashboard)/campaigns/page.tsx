"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignTable } from "@/components/campaigns/campaign-table";
import { AddCampaignDialog } from "@/components/campaigns/add-campaign-dialog";
import { CampaignToastProvider } from "@/components/campaigns/campaign-toast";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoading } from "@/components/shared/table-loading";
import { Send } from "lucide-react";

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
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Campaigns
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage and send your email campaigns.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AddCampaignDialog onCampaignCreated={reloadCampaigns} />
          </div>
        </div>

        {loading ? (
          <TableLoading />
        ) : error ? (
          <EmptyState
            title="Failed to load campaigns"
            description={error}
          />
        ) : showEmptyState ? (
          <EmptyState 
            icon={Send}
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