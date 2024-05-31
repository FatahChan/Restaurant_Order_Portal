"use client";
import React from "react";
import type { ZodIssue } from "zod";

export function ErrorMessages({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  const text = errors.join(", ");

  return <h3 className="peer text-sm text-red-600">{text}</h3>;
}
export function findErrors(fieldName: string, errors: ZodIssue[]) {
  return errors
    .filter((item) => {
      return item.path.includes(fieldName);
    })
    .map((item) => item.message);
}
