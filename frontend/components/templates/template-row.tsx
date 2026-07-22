"use client";

import { Template } from "@/types/template";
import { DeleteTemplateDialog } from "./delete-template-dialog";
import { deleteTemplate } from "@/services/templates";
import { EditTemplateDialog } from "./edit-template-dialog";
import { HtmlPreviewDialog } from "./html-preview-dialog";
import { useTemplateToast } from "./template-toast";

type TemplateRowProps = {
  template: Template;
  onChanged: () => void | Promise<void>;
};

export function TemplateRow({
  template,
  onChanged,
}: TemplateRowProps) {
  const { showToast } = useTemplateToast();

  async function handleDelete() {
    try {
      await deleteTemplate(template.id);
      await onChanged();
      showToast("Template deleted successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to delete template", "error");
    }
  }

  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40">

      <td className="px-6 py-4 text-white">
        {template.name}
      </td>

      <td className="px-6 py-4 text-muted-foreground">
        {template.subject}
      </td>

      <td className="px-6 py-4 text-center flex items-center justify-center gap-1">
        <HtmlPreviewDialog template={template} />
        <EditTemplateDialog
          template={template}
          onTemplateUpdated={onChanged}
        />
        <DeleteTemplateDialog
          onDelete={handleDelete}
        />
      </td>

    </tr>
  );
}
