"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactFormProps = {
  initialName?: string;
  initialEmail?: string;
  buttonText?: string;
  onSubmit: (name: string, email: string) => void;
};

export function ContactForm({
  initialName,
  initialEmail,
  buttonText = "Create Contact",
  onSubmit,
}: ContactFormProps) {
  const [name, setName] = useState(initialName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  return (
    <div className="space-y-5">

      <div className="space-y-2">
        <Label>Name</Label>

        <Input
          placeholder="Rahul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>

        <Input
          placeholder="rahul@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={() => onSubmit(name, email)}
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        {buttonText}
      </button>

    </div>
  );
}