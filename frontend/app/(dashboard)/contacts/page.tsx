"use client";

import { useContacts } from "@/hooks/useContacts";
import { ContactTable } from "@/components/contacts/contact-table";
import { AddContactDialog } from "@/components/contacts/add-contact-dialog";
import { SearchBar } from "@/components/contacts/search-bar";
import { Pagination } from "@/components/contacts/pagination";

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

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Contacts
          </h1>

          <p className="mt-2 text-zinc-400">
            {totalContacts} total contacts
          </p>

        </div>

        <AddContactDialog
          onContactCreated={reloadContacts}
        />

      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {loading ? (
        <div className="text-zinc-400">
          Loading contacts...
        </div>
      ) : error ? (
        <div className="text-red-500">
          {error}
        </div>
      ) : (
        <>
          <ContactTable contacts={contacts} />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

    </div>
  );
}
