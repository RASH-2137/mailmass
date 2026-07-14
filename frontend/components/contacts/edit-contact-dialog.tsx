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

type EditContactDialogProps = {
  contact: Contact;
};

export function EditContactDialog({
  contact,
}: EditContactDialogProps) {

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

      alert("Contact Updated!");

      window.location.reload();

      setOpen(false);

    } catch (error) {

      console.error(error);

      alert("Failed to update contact");

    }

  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>

        <button
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