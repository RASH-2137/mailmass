"use client";

import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <Input
      type="search"
      placeholder="Search by name or email..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        h-11
        max-w-md
        border-border
        bg-background
        text-white
        placeholder:text-muted-foreground
        caret-white
        focus-visible:ring-blue-600
      "
    />
  );
}
