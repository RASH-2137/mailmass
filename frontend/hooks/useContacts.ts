"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { getContacts } from "@/services/contacts";

const PAGE_LIMIT = 20;

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContacts(
    searchQuery: string,
    pageNumber: number
  ) {
    try {
      setLoading(true);

      const trimmed = searchQuery.trim();
      const data = await getContacts(
        trimmed ? trimmed : undefined,
        pageNumber,
        PAGE_LIMIT
      );

      setContacts(data.contacts);
      setTotalContacts(data.total_contacts);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadContacts(search, page);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, page]);

  const totalPages = Math.ceil(totalContacts / PAGE_LIMIT) || 0;

  return {
    contacts,
    totalContacts,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    reloadContacts: () => loadContacts(search, page),
  };
}
