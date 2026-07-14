"use client";

import { useContacts } from "@/hooks/useContacts";
import { ContactTable } from "@/components/contacts/contact-table";
import { AddContactDialog } from "@/components/contacts/add-contact-dialog";
import { SearchBar } from "@/components/contacts/search-bar";
import { Pagination } from "@/components/contacts/pagination";
import { ContactToastProvider } from "@/components/contacts/contact-toast";
import { ImportContactsDialog } from "@/components/contacts/import-contacts-dialog";
import { ExportContactsButton } from "@/components/contacts/export-contacts-button";
import { EmptyState } from "@/components/contacts/empty-state";
import { ContactsLoading } from "@/components/contacts/contacts-loading";

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
          <ContactsLoading />
        ) : error ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : showEmptyState ? (
          <EmptyState hasSearch={hasSearch} />
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
