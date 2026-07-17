type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10">

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {value}
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        {subtitle}
      </p>

    </div>
  );
}