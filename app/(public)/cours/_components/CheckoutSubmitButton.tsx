"use client";

import { useFormStatus } from "react-dom";

interface CheckoutSubmitButtonProps {
  className: string;
  idleLabel: string;
  pendingLabel?: string;
}

export function CheckoutSubmitButton({
  className,
  idleLabel,
  pendingLabel = "Redirection...",
}: CheckoutSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`${className} ${pending ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
