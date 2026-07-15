"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TemplateFormProps = {
  initialName?: string;
  initialSubject?: string;
  initialBody?: string;
  buttonText?: string;
  onSubmit: (name: string, subject: string, body: string) => void;
};

export function TemplateForm({
  initialName,
  initialSubject,
  initialBody,
  buttonText = "Create Template",
  onSubmit,
}: TemplateFormProps) {
  const [name, setName] = useState(initialName ?? "");
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [body, setBody] = useState(initialBody ?? "");
  return (
    <div className="space-y-5">

      <div className="space-y-2">
        <Label>Name</Label>

        <Input
          placeholder="Welcome Email"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>

        <Input
          placeholder="Welcome to our platform!"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>HTML Body</Label>

        <textarea
          placeholder="<h1>Welcome!</h1>..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
        />
      </div>

      <button
        onClick={() => onSubmit(name, subject, body)}
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        {buttonText}
      </button>

    </div>
  );
}
