"use client";

import { AccountSection } from "@/components/settings/account-section";
import { SecuritySection } from "@/components/settings/security-section";
import { EmailConfigSection } from "@/components/settings/email-config-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { AboutSection } from "@/components/settings/about-section";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-12 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your account and application preferences.</p>
      </div>

      <div className="space-y-12">
        <AccountSection />
        <SecuritySection />
        <EmailConfigSection />
        <PreferencesSection />
        <AboutSection />
      </div>
    </div>
  );
}