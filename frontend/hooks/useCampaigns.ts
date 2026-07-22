"use client";

import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/services/campaigns";

export function useCampaigns() {
  const { data: campaigns = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
  });

  return {
    campaigns,
    loading: isLoading,
    error: isError ? "Failed to load campaigns" : "",
    reloadCampaigns: () => { void refetch(); },
  };
}