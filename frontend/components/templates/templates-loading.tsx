export function TemplatesLoading() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-800" />
      </div>

      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 last:border-b-0"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </div>

    </div>
  );
}
