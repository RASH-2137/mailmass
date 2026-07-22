"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Campaign } from "@/types/campaign";
import { useCampaignRecipients } from "@/hooks/useCampaignRecipients";
import { removeCampaignRecipient } from "@/services/campaigns";
import { useCampaignToast } from "./campaign-toast";
import { AddRecipientDialog } from "./add-recipient-dialog";

type ManageRecipientsDialogProps = {
  campaign: Campaign;
  onChanged: () => void | Promise<void>;
};

export function ManageRecipientsDialog({
  campaign,
  onChanged,
}: ManageRecipientsDialogProps) {
  const [open, setOpen] = useState(false);
  
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Manage Recipients"
          className="rounded-md p-2 text-muted-foreground hover:bg-zinc-500/10 hover:text-foreground"
        >
          <Users size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Recipients: {campaign.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">Template: {campaign.template_name}</div>
        </DialogHeader>

        {open && (
          <ManageRecipientsContent 
            campaignId={campaign.id} 
            onChanged={onChanged} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ManageRecipientsContent({
  campaignId,
  onChanged,
}: {
  campaignId: number;
  onChanged: () => void | Promise<void>;
}) {
  const { recipients, campaign, loading, error, reloadRecipients } = useCampaignRecipients(campaignId);
  const { showToast } = useCampaignToast();

  async function handleRemove(contactId: number) {
    try {
      await removeCampaignRecipient(campaignId, contactId);
      showToast("Recipient removed");
      await reloadRecipients();
      await onChanged();
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to remove recipient", "error");
    }
  }

  async function handleAdd() {
    await reloadRecipients();
    await onChanged();
  }

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading recipients...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between py-2 border-b border-border">
        <h3 className="text-white font-medium">
          Recipients ({campaign?.recipients_count ?? 0})
        </h3>
        <AddRecipientDialog 
          campaignId={campaignId} 
          existingRecipientIds={new Set(recipients.map(r => r.id))}
          onAdded={handleAdd} 
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[300px] mt-4">
        {recipients.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-border rounded-md bg-card/50">
            No recipients added yet.
          </div>
        ) : (
          <div className="border border-border rounded-md divide-y divide-border">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="flex items-center justify-between px-4 py-3 bg-card">
                <div>
                  <div className="text-white text-sm font-medium">{recipient.name}</div>
                  <div className="text-muted-foreground text-sm">{recipient.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(recipient.id)}
                  className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
