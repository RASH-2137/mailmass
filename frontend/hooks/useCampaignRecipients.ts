"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { Campaign } from "@/types/campaign";
import {
  getCampaignRecipients,
  getCampaign,
} from "@/services/campaigns";

export function useCampaignRecipients(
  campaignId: number
) {
  const [recipients, setRecipients] =
    useState<Contact[]>([]);

  const [campaign, setCampaign] =
    useState<Campaign | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function reloadRecipients() {
    try {
      setLoading(true);

      const [
        recipientsData,
        campaignData,
      ] = await Promise.all([
        getCampaignRecipients(campaignId),
        getCampaign(campaignId),
      ]);

      setRecipients(recipientsData);
      setCampaign(campaignData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load recipients");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialRecipients() {
      try {
        const [
          recipientsData,
          campaignData,
        ] = await Promise.all([
          getCampaignRecipients(campaignId),
          getCampaign(campaignId),
        ]);

        setRecipients(recipientsData);
        setCampaign(campaignData);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load recipients");
      } finally {
        setLoading(false);
      }
    }

    void loadInitialRecipients();
  }, [campaignId]);

  return {
    recipients,
    campaign,
    loading,
    error,
    reloadRecipients,
  };
}