"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useContacts } from "@/hooks/useContacts";
import { addCampaignRecipients } from "@/services/campaigns";
import { useCampaignToast } from "./campaign-toast";

type AddRecipientDialogProps = {
  campaignId: number;
  existingRecipientIds: Set<number>;
  onAdded: () => void | Promise<void>;
};

export function AddRecipientDialog({
  campaignId,
  existingRecipientIds,
  onAdded,
}: AddRecipientDialogProps) {
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-md bg-muted px-3 py-1.5 text-sm text-white hover:bg-secondary transition-colors"
        >
          Add Recipients
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Recipients</DialogTitle>
        </DialogHeader>

        {open && (
          <AddRecipientContent
            campaignId={campaignId}
            existingRecipientIds={existingRecipientIds}
            onAdded={async () => {
              await onAdded();
              setOpen(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddRecipientContent({
  campaignId,
  existingRecipientIds,
  onAdded,
}: {
  campaignId: number;
  existingRecipientIds: Set<number>;
  onAdded: () => Promise<void>;
}) {
  const { contacts, loading, error, search, setSearch, page, setPage, totalPages } = useContacts();
  const { showToast } = useCampaignToast();
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const availableContacts = contacts.filter((c) => !existingRecipientIds.has(c.id));

  function toggleSelection(contactId: number) {
    const next = new Set(selectedContactIds);
    if (next.has(contactId)) {
      next.delete(contactId);
    } else {
      next.add(contactId);
    }
    setSelectedContactIds(next);
  }

  function selectAll() {
    const next = new Set(selectedContactIds);
    availableContacts.forEach((c) => next.add(c.id));
    setSelectedContactIds(next);
  }

  function deselectAll() {
    setSelectedContactIds(new Set());
  }

  async function handleAdd() {
    if (selectedContactIds.size === 0) return;

    try {
      setSubmitting(true);
      await addCampaignRecipients(campaignId, Array.from(selectedContactIds));
      showToast(`${selectedContactIds.size} recipient(s) added successfully`);
      await onAdded();
    } catch (error: unknown) {
      console.error(error);
      showToast("Failed to add recipients", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 mt-2 space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {selectedContactIds.size} selected
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={selectAll} className="hover:text-white transition-colors">Select All Visible</button>
          <span>|</span>
          <button type="button" onClick={deselectAll} className="hover:text-white transition-colors">Deselect All</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border border-border rounded-md">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading contacts...</div>
        ) : availableContacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground bg-card/50 h-full flex items-center justify-center">
            {search.trim() ? "No unadded contacts found for this search." : "All your contacts are already in this campaign."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {availableContacts.map((contact) => (
              <label key={contact.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors bg-card">
                <input
                  type="checkbox"
                  checked={selectedContactIds.has(contact.id)}
                  onChange={() => toggleSelection(contact.id)}
                  className="rounded border-border bg-card text-blue-600 focus:ring-blue-600/50"
                />
                <div>
                  <div className="text-white text-sm font-medium">{contact.name}</div>
                  <div className="text-muted-foreground text-sm">{contact.email}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-3 py-1.5 rounded bg-muted text-white text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages || 1}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading || totalPages === 0}
            className="px-3 py-1.5 rounded bg-muted text-white text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={selectedContactIds.size === 0 || submitting}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Adding..." : "Add Selected"}
        </button>
      </div>
    </div>
  );
}
