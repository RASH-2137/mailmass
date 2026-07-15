export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
      <h2 className="text-xl font-semibold text-white">
        No campaigns yet
      </h2>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        Create your first email campaign to start sending messages.
      </p>
    </div>
  );
}
