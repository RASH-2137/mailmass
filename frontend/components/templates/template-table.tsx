import { Template } from "@/types/template";
import { TemplateRow } from "./template-row";

type TemplateTableProps = {
  templates: Template[];
  onTemplateChanged: () => void | Promise<void>;
};

export function TemplateTable({
  templates,
  onTemplateChanged,
}: TemplateTableProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">

        <thead className="bg-card">
          <tr className="border-b border-border">

            <th className="px-6 py-4 text-left text-muted-foreground">
              Name
            </th>

            <th className="px-6 py-4 text-left text-muted-foreground">
              Subject
            </th>

            <th className="px-6 py-4 text-center text-muted-foreground">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>
          {templates.map((template) => (
            <TemplateRow
              key={template.id}
              template={template}
              onChanged={onTemplateChanged}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}