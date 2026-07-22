"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/analytics";

export function useDashboardStats() {
  const { data: stats = null, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  return {
    stats,
    loading: isLoading,
    error: isError ? "Failed to load analytics" : "",
    reloadStats: () => { void refetch(); },
  };
}
