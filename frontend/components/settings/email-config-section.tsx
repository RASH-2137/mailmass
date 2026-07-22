export function EmailConfigSection() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">Email Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage your email delivery settings.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">Current Provider</h3>
              <p className="text-xs text-muted-foreground">Your configured email delivery service.</p>
            </div>
            <div className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/50">
              Configured on server
            </div>
          </div>
          
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">Default Sender</h3>
              <p className="text-xs text-muted-foreground">The default email address used to send campaigns.</p>
            </div>
            <div className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/50">
              Configured on server
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
