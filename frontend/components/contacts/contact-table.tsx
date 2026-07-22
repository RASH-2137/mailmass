import { Contact } from "@/types/contact";
import { ContactRow } from "./contact-row";

type ContactTableProps = {
  contacts: Contact[];
  onContactChanged: () => void | Promise<void>;
};

export function ContactTable({
  contacts,
  onContactChanged,
}: ContactTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground w-1/3">
                Name
              </th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground hidden md:table-cell">
                Email
              </th>
              <th className="px-6 py-4 text-right font-medium text-muted-foreground w-24">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onChanged={onContactChanged}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
