"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye } from "lucide-react";
import { Template } from "@/types/template";

type HtmlPreviewDialogProps = {
  template: Template;
};

export function HtmlPreviewDialog({
  template,
}: HtmlPreviewDialogProps) {
  return (
    <Dialog>

      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-md p-2 text-muted-foreground hover:bg-zinc-500/10 hover:text-foreground"
        >
          <Eye size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Preview: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 rounded-md border border-border bg-white p-4 text-black h-96 overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: template.body }} />
        </div>

      </DialogContent>

    </Dialog>
  );
}
