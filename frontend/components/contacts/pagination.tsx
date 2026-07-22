"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">

      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-border bg-background px-4 py-2 text-sm text-white hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-border bg-background px-4 py-2 text-sm text-white hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
}
