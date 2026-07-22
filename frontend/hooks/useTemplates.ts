"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/services/templates";

export function useTemplates() {
  const { data: templates = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  return {
    templates,
    loading: isLoading,
    error: isError ? "Failed to load templates" : "",
    reloadTemplates: () => { void refetch(); },
  };
}