"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  confirmContactsImport,
  previewContactsImport,
  type ContactImportPreview,
} from "@/services/contacts";
import { useContactToast } from "./contact-toast";

type ImportContactsDialogProps = {
  onImported: () => void | Promise<void>;
};

export function ImportContactsDialog({
  onImported,
}: ImportContactsDialogProps) {
  const { showToast } = useContactToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [preview, setPreview] = useState<ContactImportPreview | null>(null);

  function resetState() {
    setPreview(null);
    setPreviewing(false);
    setConfirming(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setPreviewing(true);
      setPreview(null);

      const result = await previewContactsImport(file);
      setPreview(result);
    } catch (error) {
      console.error(error);
      showToast("Failed to preview CSV import", "error");
      resetState();
    } finally {
      setPreviewing(false);
    }
  }

  async function handleConfirmImport() {
    if (!preview) {
      return;
    }

    try {
      setConfirming(true);

      const result = await confirmContactsImport(preview.import_id);

      await onImported();

      setOpen(false);
      resetState();

      showToast(
        `${result.contacts_imported} contacts imported successfully`
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to import contacts", "error");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetState();
        }
      }}
    >

      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-md border border-zinc-700 bg-zinc-950 px-4 py-2 text-white hover:bg-zinc-800"
        >
          Import CSV
        </button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 text-white border-zinc-700">

        <DialogHeader>
          <DialogTitle>
            Import Contacts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div className="space-y-2">
            <p className="text-sm text-zinc-400">
              Upload a CSV with <span className="text-zinc-200">name</span> and{" "}
              <span className="text-zinc-200">email</span> columns.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              disabled={previewing || confirming}
              className="
                block
                w-full
                rounded-md
                border
                border-zinc-700
                bg-zinc-950
                px-3
                py-2
                text-sm
                text-zinc-300
                file:mr-4
                file:rounded-md
                file:border-0
                file:bg-blue-600
                file:px-4
                file:py-2
                file:text-sm
                file:font-medium
                file:text-white
                hover:file:bg-blue-700
                disabled:opacity-50
              "
            />
          </div>

          {previewing && (
            <p className="text-sm text-zinc-400">
              Analyzing CSV...
            </p>
          )}

          {preview && (
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                  <p className="text-zinc-400">Valid Contacts</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {preview.valid_contacts}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                  <p className="text-zinc-400">Invalid Contacts</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {preview.invalid_contacts}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                  <p className="text-zinc-400">Duplicates</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {preview.duplicates}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                  <p className="text-zinc-400">Already Exists</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {preview.already_exists}
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-400">
                {preview.total_rows} total rows scanned.{" "}
                {preview.valid_contacts > 0
                  ? `${preview.valid_contacts} ready to import.`
                  : "No valid contacts to import."}
              </p>

              {preview.preview.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-zinc-800">
                  <table className="w-full text-sm">
                    <thead className="border-b border-zinc-800 text-left text-zinc-400">
                      <tr>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.preview.slice(0, 10).map((contact) => (
                        <tr
                          key={`${contact.email}-${contact.name}`}
                          className="border-b border-zinc-800/60"
                        >
                          <td className="px-3 py-2 text-white">
                            {contact.name}
                          </td>
                          <td className="px-3 py-2 text-zinc-400">
                            {contact.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={
                  confirming || preview.valid_contacts === 0
                }
                className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {confirming
                  ? "Importing..."
                  : `Import ${preview.valid_contacts} Contacts`}
              </button>

            </div>
          )}

        </div>

      </DialogContent>

    </Dialog>
  );
}
