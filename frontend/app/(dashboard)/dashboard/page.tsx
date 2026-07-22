"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Users, LayoutTemplate, Send, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="We couldn't load your dashboard data. Please try refreshing the page."
      />
    );
  }

  const hasData = data.total_contacts > 0 || data.total_campaigns > 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Overview of your email marketing performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contacts">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="size-4" />
              Add Contact
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon={Send}
          title="Welcome to MailMass"
          description="You haven't created any campaigns or added any contacts yet. Let's get started."
          action={
            <div className="flex gap-4 mt-2">
              <Link href="/contacts">
                <Button variant="outline">Import Contacts</Button>
              </Link>
              <Link href="/campaigns">
                <Button>Create Campaign</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Contacts"
              value={String(data.total_contacts)}
              subtitle="Subscribed audience"
            />
            <StatCard
              title="Campaigns"
              value={String(data.total_campaigns)}
              subtitle="Sent and drafts"
            />
            <StatCard
              title="Emails Delivered"
              value={String(data.emails_sent)}
              subtitle="Successfully sent"
            />
            <StatCard
              title="Avg Open Rate"
              value={`${data.open_rate}%`}
              subtitle="Across all campaigns"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-center items-center min-h-[300px]">
              <BarChart3Icon className="size-10 text-muted mb-4" />
              <p className="text-sm font-medium text-muted-foreground">Performance chart coming soon</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col min-h-[300px]">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1">
                <Link href="/campaigns" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Send className="size-4" />
                    </div>
                    Send a campaign
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link href="/templates" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                      <LayoutTemplate className="size-4" />
                    </div>
                    Design a template
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link href="/contacts" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="p-2 rounded-md bg-muted text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                      <Users className="size-4" />
                    </div>
                    Manage audience
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BarChart3Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}