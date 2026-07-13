import { Input } from "@/components/ui/input";

type AuthInputProps = {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">
        {label}
      </label>

      <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="
            h-11
            border-zinc-700
            bg-zinc-950
            text-white
            placeholder:text-zinc-500
            caret-white
            focus-visible:ring-blue-600
            "
        />
    </div>
  );
}