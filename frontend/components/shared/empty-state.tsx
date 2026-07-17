import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: ReactNode;
};

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        {description}
      </p>
    </div>
  );
}
