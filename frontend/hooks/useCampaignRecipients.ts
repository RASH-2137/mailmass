"use client";

import { useQuery } from "@tanstack/react-query";
import { getCampaignRecipients, getCampaign } from "@/services/campaigns";

export function useCampaignRecipients(campaignId: number) {
  const { data: recipients = [], isLoading: loadingRecipients, isError: errorRecipients, refetch: refetchRecipients } = useQuery({
    queryKey: ["campaignRecipients", campaignId],
    queryFn: () => getCampaignRecipients(campaignId),
  });

  const { data: campaign = null, isLoading: loadingCampaign, isError: errorCampaign, refetch: refetchCampaign } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => getCampaign(campaignId),
  });

  const loading = loadingRecipients || loadingCampaign;
  const isError = errorRecipients || errorCampaign;

  function reloadRecipients() {
    void refetchRecipients();
    void refetchCampaign();
  }

  return {
    recipients,
    campaign,
    loading,
    error: isError ? "Failed to load recipients" : "",
    reloadRecipients,
  };
}