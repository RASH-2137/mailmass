"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Campaign } from "@/types/campaign";
import { CampaignForm } from "./campaign-form";
import { updateCampaign } from "@/services/campaigns";
import { useCampaignToast } from "./campaign-toast";

type EditCampaignDialogProps = {
  campaign: Campaign;
  onCampaignUpdated: () => void | Promise<void>;
};

export function EditCampaignDialog({
  campaign,
  onCampaignUpdated,
}: EditCampaignDialogProps) {
  const { showToast } = useCampaignToast();
  const [open, setOpen] = useState(false);

  async function handleEdit(
    name: string,
    templateId: number
  ) {
    try {
      await updateCampaign(campaign.id, name, templateId);
      await onCampaignUpdated();
      setOpen(false);
      showToast("Campaign updated successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to update campaign", "error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-md p-2 text-blue-400 hover:bg-blue-500/10 hover:text-blue-500"
        >
          <Pencil size={18} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <CampaignForm
          initialName={campaign.name}
          initialTemplateId={campaign.template_id}
          buttonText="Save Changes"
          onSubmit={handleEdit}
        />
      </DialogContent>
    </Dialog>
  );
}
