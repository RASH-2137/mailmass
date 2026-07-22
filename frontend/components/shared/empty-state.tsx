import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-20 text-center animate-in fade-in duration-500">
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      )}
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
