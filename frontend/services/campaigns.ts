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
