"use client";

import { useState } from "react";
import { createCampaign } from "@/services/campaigns";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CampaignForm } from "./campaign-form";
import { useCampaignToast } from "./campaign-toast";
import { Plus } from "lucide-react";

type AddCampaignDialogProps = {
  onCampaignCreated: () => void | Promise<void>;
};

export function AddCampaignDialog({
  onCampaignCreated,
}: AddCampaignDialogProps) {
  const { showToast } = useCampaignToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    name: string,
    templateId: number
  ) {
    try {
      setIsLoading(true);
      await createCampaign(name, templateId);
      await onCampaignCreated();
      setOpen(false);
      showToast("Campaign created successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to create campaign", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <CampaignForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
