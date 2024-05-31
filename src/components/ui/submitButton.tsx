"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  className,
  children,
  disabled,
  ...rest
}: React.HTMLProps<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn("rounded-md bg-black p-2 text-white", className)}
      disabled={disabled ?? pending}
      {...rest}
      type={"submit"}
    >
      {children}
    </button>
  );
}
