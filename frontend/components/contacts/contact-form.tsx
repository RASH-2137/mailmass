"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ContactFormProps = {
  initialName?: string;
  initialEmail?: string;
  buttonText?: string;
  onSubmit: (name: string, email: string) => Promise<void> | void;
  isLoading?: boolean;
};

export function ContactForm({
  initialName,
  initialEmail,
  buttonText = "Create Contact",
  onSubmit,
  isLoading = false,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialName ?? "",
      email: initialEmail ?? "",
    },
  });

  const onFormSubmit = async (data: ContactFormValues) => {
    await onSubmit(data.name, data.email);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Rahul Sharma"
          aria-invalid={!!errors.name}
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="rahul@gmail.com"
          aria-invalid={!!errors.email}
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : buttonText}
      </Button>
    </form>
  );
}