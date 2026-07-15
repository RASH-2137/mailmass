"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTemplates } from "@/hooks/useTemplates";

type CampaignFormProps = {
  initialName?: string;
  initialTemplateId?: number;
  buttonText?: string;
  onSubmit: (name: string, templateId: number) => void;
};

export function CampaignForm({
  initialName,
  initialTemplateId,
  buttonText = "Create Campaign",
  onSubmit,
}: CampaignFormProps) {
  const [name, setName] = useState(initialName ?? "");
  const [templateId, setTemplateId] = useState(initialTemplateId ?? 0);
  const { templates, loading, error } = useTemplates();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          placeholder="Summer Sale"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Template</Label>
        {loading ? (
          <div className="text-sm text-zinc-400">Loading templates...</div>
        ) : error ? (
          <div className="text-sm text-red-500">Failed to load templates</div>
        ) : (
          <select
            className="flex w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            value={templateId}
            onChange={(e) => setTemplateId(Number(e.target.value))}
          >
            <option value={0} disabled>
              Select a template
            </option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={() => onSubmit(name, templateId)}
        disabled={!name || templateId === 0}
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    </div>
  );
}
