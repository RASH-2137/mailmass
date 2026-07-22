"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/services/contacts";

const PAGE_LIMIT = 20;

export function useContacts() {
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contacts", search, page],
    queryFn: () => getContacts(search.trim() || undefined, page, PAGE_LIMIT),
  });

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }

  const contacts = data?.contacts || [];
  const totalContacts = data?.total_contacts || 0;
  const totalPages = Math.ceil(totalContacts / PAGE_LIMIT) || 0;

  return {
    contacts,
    totalContacts,
    loading: isLoading,
    error: isError ? "Failed to load contacts" : "",
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    reloadContacts: () => { void refetch(); },
  };
}
