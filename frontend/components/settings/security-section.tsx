import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SecuritySection() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">Manage your account security and password.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 space-y-6 relative">
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-500 uppercase tracking-wider ring-1 ring-inset ring-blue-500/20">
              Coming Soon
            </span>
          </div>

          <div className="space-y-4 opacity-50 pointer-events-none">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                disabled
                placeholder="••••••••"
                className="max-w-md bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                disabled
                placeholder="••••••••"
                className="max-w-md bg-background"
              />
              <p className="text-[0.8rem] text-muted-foreground">Password must be at least 8 characters.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Update your account password to maintain security.</p>
          <Button disabled>Update Password</Button>
        </div>
      </div>
    </div>
  );
}
