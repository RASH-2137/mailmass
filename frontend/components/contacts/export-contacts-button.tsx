"use client";

import { useState } from "react";
import { exportContacts } from "@/services/contacts";
import { useContactToast } from "./contact-toast";

export function ExportContactsButton() {
  const { showToast } = useContactToast();
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    try {
      setExporting(true);

      const blob = await exportContacts();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "contacts.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast("Contacts exported successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to export contacts", "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="rounded-md border border-zinc-700 bg-zinc-950 px-4 py-2 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {exporting ? "Exporting..." : "Export CSV"}
    </button>
  );
}
