"use client";

import { Contact } from "@/types/contact";
import { DeleteContactDialog } from "./delete-contact-dialog";
import { deleteContact } from "@/services/contacts";
import { EditContactDialog } from "./edit-contact-dialog";
import { useContactToast } from "./contact-toast";

type ContactRowProps = {
  contact: Contact;
  onChanged: () => void | Promise<void>;
};

export function ContactRow({
  contact,
  onChanged,
}: ContactRowProps) {
  const { showToast } = useContactToast();

  async function handleDelete() {
    try {
      await deleteContact(contact.id);
      await onChanged();
      showToast("Contact deleted successfully");
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to delete contact", "error");
    }
  }

  return (
    <tr className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40">

      <td className="px-6 py-4">
        {contact.name}
      </td>

      <td className="px-6 py-4 text-zinc-400">
        {contact.email}
      </td>

      <td className="px-6 py-4 text-center">
        <EditContactDialog
          contact={contact}
          onContactUpdated={onChanged}
        />
        <DeleteContactDialog
          onDelete={handleDelete}
        />
      </td>

    </tr>
  );
}
