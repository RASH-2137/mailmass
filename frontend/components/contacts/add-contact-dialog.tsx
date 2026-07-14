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

type AddContactDialogProps = {
  onContactCreated: () => void;
};

export function AddContactDialog({
  onContactCreated,
}: AddContactDialogProps) {
    const [open, setOpen] = useState(false);

    async function handleSubmit(
    name: string,
    email: string
    ) {
    try {

        await createContact(name, email);

        await onContactCreated();

        setOpen(false);

        alert("Contact Created!");

    }
    catch (error: unknown) {
        console.log(error);

        const err = error as {
          response?: {
            data?: unknown;
          };
        };

        console.log(err.response);

        console.log(err.response?.data);

        alert("Failed to create contact");
    }
    }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

    <DialogTrigger>

    <button
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