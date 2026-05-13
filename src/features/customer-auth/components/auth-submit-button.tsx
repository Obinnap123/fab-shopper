"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthSubmitButtonProps = {
  isSubmitting: boolean;
  label: string;
};

export function AuthSubmitButton({ isSubmitting, label }: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
    >
      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : label}
    </Button>
  );
}
