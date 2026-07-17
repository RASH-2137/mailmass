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
  const showEmptyState =
    !loading && !error && contacts.length === 0;

  return (
    <ContactToastProvider>
      <div className="space-y-8">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-white">
              Contacts
            </h1>

            <p className="mt-2 text-zinc-400">
              {totalContacts} total contacts
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ExportContactsButton />
            <ImportContactsDialog onImported={reloadContacts} />
            <AddContactDialog onContactCreated={reloadContacts} />
          </div>

        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {loading ? (
          <TableLoading />
        ) : error ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : showEmptyState ? (
          <EmptyState 
            title={hasSearch ? "No matching contacts" : "No contacts yet"}
            description={hasSearch ? "Try a different name or email, or clear your search to see all contacts." : "Add your first contact or import a CSV to start building your audience."}
          />
        ) : (
          <>
            <ContactTable
              contacts={contacts}
              onContactChanged={reloadContacts}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

      </div>
    </ContactToastProvider>
  );
}
