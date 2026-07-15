"use client";

import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { getCampaigns } from "@/services/campaigns";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reloadCampaigns() {
    try {
      setLoading(true);

      const data = await getCampaigns();

      setCampaigns(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialCampaigns() {
      try {
        const data = await getCampaigns();

        setCampaigns(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    }

    void loadInitialCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    reloadCampaigns,
  };
}