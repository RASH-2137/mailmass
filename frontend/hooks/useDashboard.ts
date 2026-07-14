"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboard";
import { DashboardStats } from "@/types/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboard = await getDashboardStats();
        setData(dashboard);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    data,
    loading,
    error,
  };
}