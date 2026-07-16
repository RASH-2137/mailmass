"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/types/analytics";
import { getDashboardStats } from "@/services/analytics";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    void loadInitialStats();
  }, []);

  return {
    stats,
    loading,
    error,
    reloadStats: loadStats,
  };
}
