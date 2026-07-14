type EmptyStateProps = {
  hasSearch: boolean;
};

export function EmptyState({
  hasSearch,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">

      <h2 className="text-xl font-semibold text-white">
        {hasSearch ? "No matching contacts" : "No contacts yet"}
      </h2>

      <p className="mt-2 max-w-md text-sm text-zinc-400">
        {hasSearch
          ? "Try a different name or email, or clear your search to see all contacts."
          : "Add your first contact or import a CSV to start building your audience."}
      </p>

    </div>
  );
}
