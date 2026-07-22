"use client";

import { useTemplates } from "@/hooks/useTemplates";
import { TemplateGrid } from "@/components/templates/template-grid";
import { AddTemplateDialog } from "@/components/templates/add-template-dialog";
import { TemplateToastProvider } from "@/components/templates/template-toast";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoading } from "@/components/shared/table-loading";
import { LayoutTemplate } from "lucide-react";

export default function TemplatesPage() {
  const {
    templates,
    loading,
    error,
    reloadTemplates,
  } = useTemplates();

  const showEmptyState = !loading && !error && templates.length === 0;

  return (
    <TemplateToastProvider>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Templates
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Design and manage your email templates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AddTemplateDialog onTemplateCreated={reloadTemplates} />
          </div>
        </div>

        {loading ? (
          <TableLoading />
        ) : error ? (
          <EmptyState
            title="Failed to load templates"
            description={error}
          />
        ) : showEmptyState ? (
          <EmptyState 
            icon={LayoutTemplate}
            title="No templates yet"
            description="Create your first email template to get started."
          />
        ) : (
          <TemplateGrid
            templates={templates}
            onTemplateChanged={reloadTemplates}
          />
        )}
      </div>
    </TemplateToastProvider>
  );
}