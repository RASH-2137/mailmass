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
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      <table className="w-full">

        <thead className="bg-zinc-900">
          <tr className="border-b border-zinc-800">

            <th className="px-6 py-4 text-left text-zinc-400">
              Name
            </th>

            <th className="px-6 py-4 text-left text-zinc-400">
              Subject
            </th>

            <th className="px-6 py-4 text-center text-zinc-400">
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