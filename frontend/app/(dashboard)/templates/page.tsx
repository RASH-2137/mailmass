"use client";

import { useTemplates } from "@/hooks/useTemplates";
import { TemplateTable } from "@/components/templates/template-table";
import { AddTemplateDialog } from "@/components/templates/add-template-dialog";
import { TemplateToastProvider } from "@/components/templates/template-toast";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoading } from "@/components/shared/table-loading";

export default function TemplatesPage() {
  const {
    templates,
    loading,
    error,
    reloadTemplates,
  } = useTemplates();

  const showEmptyState =
    !loading && !error && templates.length === 0;

  return (
    <TemplateToastProvider>
      <div className="space-y-8">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-white">
              Templates
            </h1>

            <p className="mt-2 text-zinc-400">
              {templates.length} total templates
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AddTemplateDialog onTemplateCreated={reloadTemplates} />
          </div>

        </div>

        {loading ? (
          <TableLoading />
        ) : error ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : showEmptyState ? (
          <EmptyState 
            title="No templates yet"
            description="Create your first email template to get started."
          />
        ) : (
          <TemplateTable
            templates={templates}
            onTemplateChanged={reloadTemplates}
          />
        )}

      </div>
    </TemplateToastProvider>
  );
}