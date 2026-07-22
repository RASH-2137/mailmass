"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Campaign } from "@/types/campaign";
import { sendCampaign } from "@/services/campaigns";
import { useCampaignToast } from "./campaign-toast";

type SendCampaignDialogProps = {
  campaign: Campaign;
  onSent: () => void | Promise<void>;
};

export function SendCampaignDialog({ campaign, onSent }: SendCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { showToast } = useCampaignToast();

  const isMissingTemplate = !campaign.template_id;
  const isMissingRecipients = campaign.recipients_count === 0;
  const cannotSend = isMissingTemplate || isMissingRecipients;

  async function handleSend() {
    try {
      setSending(true);
      await sendCampaign(campaign.id);
      showToast("Campaign queued successfully!");
      await onSent();
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to send campaign", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Send Campaign"
          className="rounded-md p-2 text-muted-foreground hover:bg-zinc-500/10 hover:text-white transition-colors"
        >
          <Send size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to send this campaign? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 border-y border-border">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-muted-foreground">Campaign Name:</div>
            <div className="col-span-2 text-white font-medium">{campaign.name}</div>
            
            <div className="text-muted-foreground">Template:</div>
            <div className="col-span-2 text-white">{campaign.template_name}</div>
            
            <div className="text-muted-foreground">Recipients:</div>
            <div className="col-span-2 text-white">{campaign.recipients_count}</div>
            
            <div className="text-muted-foreground">Status:</div>
            <div className="col-span-2 text-white capitalize">{campaign.status}</div>
          </div>
          
          {cannotSend && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Cannot send this campaign yet:</p>
              <ul className="list-disc list-inside">
                {isMissingTemplate && <li>No template is selected.</li>}
                {isMissingRecipients && <li>There are no recipients attached.</li>}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm text-white hover:bg-muted transition-colors"
            disabled={sending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={cannotSend || sending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {sending ? "Sending..." : "Send Campaign"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
