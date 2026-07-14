"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Contact } from "@/types/contact";
import { ContactForm } from "./contact-form";
import { updateContact } from "@/services/contacts";
import { useContactToast } from "./contact-toast";

type EditContactDialogProps = {
  contact: Contact;
  onContactUpdated: () => void | Promise<void>;
};

export function EditContactDialog({
  contact,
  onContactUpdated,
}: EditContactDialogProps) {
  const { showToast } = useContactToast();
  const [open, setOpen] = useState(false);

  async function handleEdit(
    name: string,
    email: string
  ) {
    try {
      await updateContact(
        contact.id,
        name,
        email
      );

      await onContactUpdated();

      setOpen(false);

      showToast("Contact updated successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to update contact", "error");
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
          className="rounded-md p-2 text-blue-400 hover:bg-blue-500/10 hover:text-blue-500"
        >
          <Pencil size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Edit Contact
          </DialogTitle>
        </DialogHeader>

        <ContactForm
          initialName={contact.name}
          initialEmail={contact.email}
          buttonText="Save Changes"
          onSubmit={handleEdit}
        />

      </DialogContent>

    </Dialog>
  );
}
