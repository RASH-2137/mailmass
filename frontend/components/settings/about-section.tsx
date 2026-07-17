export function AboutSection() {
  const techStack = [
    { label: "Application", value: "MailMass" },
    { label: "Version", value: "v1.0" },
    { label: "Frontend", value: "Next.js" },
    { label: "Backend", value: "FastAPI" },
    { label: "Queue", value: "Celery" },
    { label: "Database", value: "PostgreSQL" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">About</h2>
      
      <div className="max-w-md">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
              MM
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">MailMass</h3>
              <p className="text-sm text-zinc-400">Email Marketing Platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            {techStack.map((item) => (
              <div key={item.label} className="border-b border-zinc-800/50 pb-2 last:border-0">
                <span className="block text-zinc-400 text-xs uppercase tracking-wider mb-1">
                  {item.label}
                </span>
                <span className="font-medium text-zinc-200">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
