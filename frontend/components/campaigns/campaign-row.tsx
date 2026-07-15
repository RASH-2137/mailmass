"use client";

import { Campaign } from "@/types/campaign";
import { DeleteCampaignDialog } from "./delete-campaign-dialog";
import { deleteCampaign } from "@/services/campaigns";
import { EditCampaignDialog } from "./edit-campaign-dialog";
import { useCampaignToast } from "./campaign-toast";

type CampaignRowProps = {
  campaign: Campaign;
  onChanged: () => void | Promise<void>;
};

export function CampaignRow({
  campaign,
  onChanged,
}: CampaignRowProps) {
  const { showToast } = useCampaignToast();

  async function handleDelete() {
    try {
      await deleteCampaign(campaign.id);
      await onChanged();
      showToast("Campaign deleted successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to delete campaign", "error");
    }
  }

  return (
    <tr className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40">
      <td className="px-6 py-4 text-white">
        {campaign.name}
      </td>
      <td className="px-6 py-4 text-zinc-400">
        {campaign.template_name}
      </td>
      <td className="px-6 py-4 text-zinc-400">
        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
          {campaign.status}
        </span>
      </td>
      <td className="px-6 py-4 text-zinc-400 text-right">
        {campaign.recipients_count}
      </td>
      <td className="px-6 py-4 text-zinc-400 text-right">
        {campaign.emails_sent}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <EditCampaignDialog
            campaign={campaign}
            onCampaignUpdated={onChanged}
          />
          <DeleteCampaignDialog onDelete={handleDelete} />
        </div>
      </td>
    </tr>
  );
}
