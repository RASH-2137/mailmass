import { Card, CardContent } from "@/components/ui/card";

export function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md rounded-2xl border-border bg-card/90 backdrop-blur-sm shadow-2xl">
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
}