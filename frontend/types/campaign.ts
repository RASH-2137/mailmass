export interface Campaign {
  id: number;
  name: string;
  template_id: number;
  template_name: string;
  status: string;
  recipients_count: number;
  emails_sent: number;
  opens?: number;
  clicks?: number;
  open_rate?: number;
  click_rate?: number;
}

export type CreateCampaignRequest = {
  name: string;
  template_id: number;
};
