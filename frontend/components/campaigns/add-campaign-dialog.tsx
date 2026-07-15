"use client";

import { useState } from "react";
import { createCampaign } from "@/services/campaigns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CampaignForm } from "./campaign-form";
import { useCampaignToast } from "./campaign-toast";

type AddCampaignDialogProps = {
  onCampaignCreated: () => void | Promise<void>;
};

export function AddCampaignDialog({
  onCampaignCreated,
}: AddCampaignDialogProps) {
  const { showToast } = useCampaignToast();
  const [open, setOpen] = useState(false);

  async function handleSubmit(
    name: string,
    templateId: number
  ) {
    try {
      await createCampaign(name, templateId);
      await onCampaignCreated();
      setOpen(false);
      showToast("Campaign created successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to create campaign", "error");
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
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Campaign
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Campaign</DialogTitle>
        </DialogHeader>
        <CampaignForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
