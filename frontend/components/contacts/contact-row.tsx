"use client";

import { Contact } from "@/types/contact";
import { DeleteContactDialog } from "./delete-contact-dialog";
import { deleteContact } from "@/services/contacts";
import { EditContactDialog } from "./edit-contact-dialog";
import { useContactToast } from "./contact-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  
  const initials = contact.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40 group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{contact.name}</span>
            <span className="text-xs text-muted-foreground md:hidden">{contact.email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
        {contact.email}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditContactDialog
            contact={contact}
            onContactUpdated={onChanged}
          />
          <DeleteContactDialog
            onDelete={handleDelete}
          />
        </div>
      </td>
    </tr>
  );
}
