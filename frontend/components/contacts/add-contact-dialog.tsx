"use client";

import { useState } from "react";
import { createContact } from "@/services/contacts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ContactForm } from "./contact-form";
import { useContactToast } from "./contact-toast";

type AddContactDialogProps = {
  onContactCreated: () => void | Promise<void>;
};

export function AddContactDialog({
  onContactCreated,
}: AddContactDialogProps) {
  const { showToast } = useContactToast();
  const [open, setOpen] = useState(false);

  async function handleSubmit(
    name: string,
    email: string
  ) {
    try {
      await createContact(name, email);

      await onContactCreated();

      setOpen(false);

      showToast("Contact created successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to create contact", "error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Contact
        </button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Add Contact
          </DialogTitle>
        </DialogHeader>

        <ContactForm
          onSubmit={handleSubmit}
        />

      </DialogContent>

    </Dialog>
  );
}
