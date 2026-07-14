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
        border-zinc-700
        bg-zinc-950
        text-white
        placeholder:text-zinc-500
        caret-white
        focus-visible:ring-blue-600
      "
    />
  );
}
