"use client";

import { AccountSection } from "@/components/settings/account-section";
import { SecuritySection } from "@/components/settings/security-section";
import { EmailConfigSection } from "@/components/settings/email-config-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { AboutSection } from "@/components/settings/about-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/useProfile";

function ProfileHeader() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center gap-5 mb-8 p-6 rounded-xl border border-border bg-card/40">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 p-6 rounded-xl border border-border bg-card shadow-sm animate-in fade-in duration-500">
      <Avatar className="size-16 md:size-20 border-2 border-border shadow-sm">
        <AvatarImage src="https://github.com/shadcn.png" alt={profile?.name || "User Avatar"} />
        <AvatarFallback className="text-xl md:text-2xl">{profile?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          {profile?.name || "User Name"}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          {profile?.email || "user@example.com"}
        </p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <ProfileHeader />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50 p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email Config</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <AccountSection />
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
          <SecuritySection />
        </TabsContent>
        <TabsContent value="email" className="space-y-6">
          <EmailConfigSection />
        </TabsContent>
        <TabsContent value="preferences" className="space-y-6">
          <PreferencesSection />
        </TabsContent>
        <TabsContent value="about" className="space-y-6">
          <AboutSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}