"use client";

import { useProfile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AccountSection() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your personal information.</p>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 max-w-2xl">
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-md w-full" />
            <div className="h-10 bg-muted rounded-md w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your personal information.</p>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 max-w-2xl text-destructive text-sm">
          Failed to load profile data.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={profile.name}
              readOnly
              className="max-w-md bg-muted/50 cursor-not-allowed"
            />
            <p className="text-[0.8rem] text-muted-foreground">Your name as it appears across the platform.</p>
          </div>
          
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={profile.email}
              readOnly
              className="max-w-md bg-muted/50 cursor-not-allowed"
            />
            <p className="text-[0.8rem] text-muted-foreground">The email address associated with your account.</p>
          </div>
        </div>
        
        <div className="bg-muted/30 px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Profile editing is managed by the administrator.</p>
          <Button disabled variant="outline">Save</Button>
        </div>
      </div>
    </div>
  );
}
