"use client";

import { useState } from "react";
import { exportContacts } from "@/services/contacts";
import { useContactToast } from "./contact-toast";
import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
