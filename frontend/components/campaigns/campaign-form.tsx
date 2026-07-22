"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/useTemplates";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

type CampaignFormProps = {
  initialName?: string;
  initialTemplateId?: number;
  buttonText?: string;
  onSubmit: (name: string, templateId: number) => Promise<void> | void;
  isLoading?: boolean;
};

export function CampaignForm({
  initialName,
  initialTemplateId,
  buttonText = "Create Campaign",
  onSubmit,
  isLoading = false,
}: CampaignFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName ?? "");
  const [templateId, setTemplateId] = useState(initialTemplateId ?? 0);
  const { templates, loading, error } = useTemplates();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    await onSubmit(name, templateId);
  };

  const selectedTemplate = templates.find((t) => t.id === templateId);

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                step >= i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > i ? <CheckCircle2 className="size-4" /> : i}
            </div>
            {i < 3 && (
              <div
                className={`h-0.5 w-12 sm:w-24 mx-2 transition-colors ${
                  step > i ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-foreground">Campaign Details</h3>
            <p className="text-sm text-muted-foreground">Give your campaign a clear name.</p>
          </div>
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input
              placeholder="e.g. Summer Newsletter 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleNext} disabled={!name.trim()}>
              Next <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-foreground">Select Template</h3>
            <p className="text-sm text-muted-foreground">Choose the design for this campaign.</p>
          </div>
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading templates...</div>
            ) : error ? (
              <div className="text-sm text-destructive">Failed to load templates</div>
            ) : (
              <div className="grid gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`flex flex-col items-start p-4 rounded-lg border text-left transition-all ${
                      templateId === t.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium text-foreground">{t.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {t.subject}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={templateId === 0}>
              Next <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-foreground">Review & Create</h3>
            <p className="text-sm text-muted-foreground">Review your choices before creating.</p>
          </div>
          
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium text-foreground">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template:</span>
              <span className="font-medium text-foreground">{selectedTemplate?.name || "None"}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : buttonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
