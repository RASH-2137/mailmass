import { Contact } from "@/types/contact";
import { ContactRow } from "./contact-row";

type ContactTableProps = {
  contacts: Contact[];
};

export function ContactTable({
  contacts,
}: ContactTableProps) {

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

      <table className="w-full">

        <thead className="border-b border-zinc-800">

         <tr>

            <th className="px-6 py-4 text-left text-zinc-400">
                Name
            </th>

            <th className="px-6 py-4 text-left text-zinc-400">
                Email
            </th>

            <th className="px-6 py-4 text-center text-zinc-400">
                Actions
            </th>

         </tr>

        </thead>

        <tbody>

          {contacts.map((contact) => (
            <ContactRow
              key={contact.id}
              contact={contact}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}