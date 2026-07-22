"use client";

import { Template } from "@/types/template";
import { DeleteTemplateDialog } from "./delete-template-dialog";
import { deleteTemplate } from "@/services/templates";
import { EditTemplateDialog } from "./edit-template-dialog";
import { HtmlPreviewDialog } from "./html-preview-dialog";
import { useTemplateToast } from "./template-toast";
import { LayoutTemplate, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

type TemplateGridProps = {
  templates: Template[];
  onTemplateChanged: () => void | Promise<void>;
};

export function TemplateGrid({
  templates,
  onTemplateChanged,
}: TemplateGridProps) {
  const { showToast } = useTemplateToast();

  async function handleDelete(id: number) {
    try {
      await deleteTemplate(id);
      await onTemplateChanged();
      showToast("Template deleted successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to delete template", "error");
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((template) => (
        <div 
          key={template.id} 
          className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50"
        >
          <div className="flex h-32 items-center justify-center bg-muted/30 border-b border-border/50 group-hover:bg-muted/50 transition-colors">
            <LayoutTemplate className="size-10 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-medium text-foreground line-clamp-1">{template.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {template.subject}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <HtmlPreviewDialog template={template} />
              <div className="flex items-center gap-1">
                <EditTemplateDialog
                  template={template}
                  onTemplateUpdated={onTemplateChanged}
                />
                <DeleteTemplateDialog
                  onDelete={() => handleDelete(template.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
