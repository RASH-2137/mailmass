"use client";

import { useContacts } from "@/hooks/useContacts";
import { ContactTable } from "@/components/contacts/contact-table";
import { AddContactDialog } from "@/components/contacts/add-contact-dialog";
import { SearchBar } from "@/components/contacts/search-bar";
import { Pagination } from "@/components/contacts/pagination";
import { ContactToastProvider } from "@/components/contacts/contact-toast";
import { ImportContactsDialog } from "@/components/contacts/import-contacts-dialog";
import { ExportContactsButton } from "@/components/contacts/export-contacts-button";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoading } from "@/components/shared/table-loading";
import { Users, SearchX } from "lucide-react";

export default function ContactsPage() {
  const {
    contacts,
    totalContacts,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    reloadContacts,
  } = useContacts();

  const hasSearch = search.trim().length > 0;
  const showEmptyState = !loading && !error && contacts.length === 0;

  return (
    <ContactToastProvider>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Audience
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your contacts and subscribers. You have {totalContacts} total contacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ExportContactsButton />
            <ImportContactsDialog onImported={reloadContacts} />
            <AddContactDialog onContactCreated={reloadContacts} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-sm">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {loading ? (
          <TableLoading />
        ) : error ? (
          <EmptyState
            title="Failed to load contacts"
            description={error}
          />
        ) : showEmptyState ? (
          <EmptyState 
            icon={hasSearch ? SearchX : Users}
            title={hasSearch ? "No matching contacts" : "No contacts yet"}
            description={hasSearch ? "Try a different name or email, or clear your search to see all contacts." : "Add your first contact or import a CSV to start building your audience."}
          />
        ) : (
          <div className="space-y-4">
            <ContactTable
              contacts={contacts}
              onContactChanged={reloadContacts}
            />
            {totalPages > 1 && (
              <div className="flex justify-end mt-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </ContactToastProvider>
  );
}
