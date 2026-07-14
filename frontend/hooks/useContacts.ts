"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { getContacts } from "@/services/contacts";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContacts(searchQuery: string) {
    try {
      setLoading(true);

      const trimmed = searchQuery.trim();
      const data = await getContacts(
        trimmed ? trimmed : undefined
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadContacts(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return {
    contacts,
    totalContacts,
    loading,
    error,
    search,
    setSearch,
    reloadContacts: () => loadContacts(search),
  };
}
