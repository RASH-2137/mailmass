import { Button } from "@/components/ui/button";

type AuthButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export function AuthButton({
  children,
  onClick,
}: AuthButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="h-11 w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
    >
      {children}
    </Button>
  );
}