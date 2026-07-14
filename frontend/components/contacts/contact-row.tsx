import { Contact } from "@/types/contact";
import { DeleteContactDialog } from "./delete-contact-dialog";
import { deleteContact } from "@/services/contacts";
import { EditContactDialog } from "./edit-contact-dialog";

type ContactRowProps = {
  contact: Contact;
};

export function ContactRow({
  contact,
}: ContactRowProps) {

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors">

      <td className="px-6 py-4">
        {contact.name}
      </td>

      <td className="px-6 py-4 text-zinc-400">
        {contact.email}
      </td>

      <td className="px-6 py-4 text-center">

        <EditContactDialog contact={contact} />
        <DeleteContactDialog
            onDelete={async () => {
                await deleteContact(contact.id);

                window.location.reload();
            }}
        />

      </td>

    </tr>
  );
}