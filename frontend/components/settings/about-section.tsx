import { Mail } from "lucide-react";

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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">About</h2>
        <p className="text-sm text-muted-foreground">Information about this MailMass instance.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/20">
              <Mail className="size-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">MailMass</h3>
              <p className="text-sm text-muted-foreground mt-1">Open Source Email Marketing Platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-6">
            {techStack.map((item) => (
              <div key={item.label} className="space-y-1">
                <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                <span className="block text-sm font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-muted/30 px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">MailMass is built for high-performance marketing.</p>
        </div>
      </div>
    </div>
  );
}
