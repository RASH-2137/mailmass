"use client";

import { useEffect, useState } from "react";
import { Template } from "@/types/template";
import { getTemplates } from "@/services/templates";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reloadTemplates() {
    try {
      setLoading(true);

      const data = await getTemplates();

      setTemplates(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialTemplates() {
      try {
        const data = await getTemplates();

        setTemplates(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    }

    void loadInitialTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    reloadTemplates,
  };
}