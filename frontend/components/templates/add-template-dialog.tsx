"use client";

import { useState } from "react";
import { createTemplate } from "@/services/templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TemplateForm } from "./template-form";
import { useTemplateToast } from "./template-toast";

type AddTemplateDialogProps = {
  onTemplateCreated: () => void | Promise<void>;
};

export function AddTemplateDialog({
  onTemplateCreated,
}: AddTemplateDialogProps) {
  const { showToast } = useTemplateToast();
  const [open, setOpen] = useState(false);

  async function handleSubmit(
    name: string,
    subject: string,
    body: string
  ) {
    try {
      await createTemplate(name, subject, body);

      await onTemplateCreated();

      setOpen(false);

      showToast("Template created successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to create template", "error");
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
          + Add Template
        </button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Add Template
          </DialogTitle>
        </DialogHeader>

        <TemplateForm
          onSubmit={handleSubmit}
        />

      </DialogContent>

    </Dialog>
  );
}
