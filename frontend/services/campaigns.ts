import api from "@/lib/api";
import { Campaign } from "@/types/campaign";

export async function getCampaigns(): Promise<Campaign[]> {
  const response = await api.get("/campaigns");
  return response.data;
}

export async function createCampaign(
  name: string,
  template_id: number
) {
  const response = await api.post("/campaigns", {
    name,
    template_id,
  });

  return response.data;
}

export async function updateCampaign(
  campaignId: number,
  name: string,
  template_id: number
) {
  const response = await api.put(
    `/campaigns/${campaignId}`,
    {
      name,
      template_id,
    }
  );

  return response.data;
}

export async function deleteCampaign(
  campaignId: number
) {
  const response = await api.delete(
    `/campaigns/${campaignId}`
  );

  return response.data;
}

export async function sendCampaign(campaignId: number) {
  const response = await api.post(`/campaigns/${campaignId}/send`);
  return response.data;
}

import { Contact } from "@/types/contact";

export async function getCampaign(campaignId: number): Promise<Campaign> {
  const response = await api.get(`/campaigns/${campaignId}`);
  return response.data;
}

export async function getCampaignRecipients(campaignId: number): Promise<Contact[]> {
  const response = await api.get(`/campaigns/${campaignId}/recipients`);
  return response.data;
}

export async function addCampaignRecipients(campaignId: number, contact_ids: number[]) {
  const response = await api.post(`/campaigns/${campaignId}/recipients`, {
    contact_ids,
  });
  return response.data;
}

export async function removeCampaignRecipient(campaignId: number, contactId: number) {
  const response = await api.delete(`/campaigns/${campaignId}/recipients/${contactId}`);
  return response.data;
}
