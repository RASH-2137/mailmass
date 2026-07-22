"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboard";

export function useDashboard() {
  const { data = null, isLoading, isError } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  return {
    data,
    loading: isLoading,
    error: isError ? "Failed to load dashboard" : "",
  };
}