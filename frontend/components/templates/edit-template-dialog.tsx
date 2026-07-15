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

import { Template } from "@/types/template";
import { TemplateForm } from "./template-form";
import { updateTemplate } from "@/services/templates";
import { useTemplateToast } from "./template-toast";

type EditTemplateDialogProps = {
  template: Template;
  onTemplateUpdated: () => void | Promise<void>;
};

export function EditTemplateDialog({
  template,
  onTemplateUpdated,
}: EditTemplateDialogProps) {
  const { showToast } = useTemplateToast();
  const [open, setOpen] = useState(false);

  async function handleEdit(
    name: string,
    subject: string,
    body: string
  ) {
    try {
      await updateTemplate(
        template.id,
        name,
        subject,
        body
      );

      await onTemplateUpdated();

      setOpen(false);

      showToast("Template updated successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to update template", "error");
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
          <DialogTitle>
            Edit Template
          </DialogTitle>
        </DialogHeader>

        <TemplateForm
          initialName={template.name}
          initialSubject={template.subject}
          initialBody={template.body}
          buttonText="Save Changes"
          onSubmit={handleEdit}
        />

      </DialogContent>

    </Dialog>
  );
}
