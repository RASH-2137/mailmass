"use client";

import { Campaign } from "@/types/campaign";
import { DeleteCampaignDialog } from "./delete-campaign-dialog";
import { deleteCampaign } from "@/services/campaigns";
import { EditCampaignDialog } from "./edit-campaign-dialog";
import { useCampaignToast } from "./campaign-toast";
import { ManageRecipientsDialog } from "./manage-recipients-dialog";
import { SendCampaignDialog } from "./send-campaign-dialog";

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

  function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case "draft":
        return <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/10">Draft</span>;
      case "sending":
        return <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">Sending</span>;
      case "completed":
        return <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">Completed</span>;
      case "failed":
        return <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">Failed</span>;
      default:
        return <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{status}</span>;
    }
  }

  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40 group">
      <td className="px-6 py-4">
        <span className="font-medium text-foreground">{campaign.name}</span>
      </td>
      <td className="px-6 py-4 text-muted-foreground">
        {campaign.template_name || "—"}
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(campaign.status)}
      </td>
      <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">
        {campaign.recipients_count}
      </td>
      <td className="px-6 py-4 text-muted-foreground text-right tabular-nums">
        {campaign.emails_sent}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <SendCampaignDialog
            campaign={campaign}
            onSent={onChanged}
          />
          <ManageRecipientsDialog
            campaign={campaign}
            onChanged={onChanged}
          />
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
