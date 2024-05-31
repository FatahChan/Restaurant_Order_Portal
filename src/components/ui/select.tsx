"use client";
import React from "react";
import { ErrorMessages } from "./formErrorMessages";

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  label: string;
  id: string;
  errors: string[];
  children: React.ReactNode;
}
export function Select({ label, id, errors, children, ...rest }: SelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select type={id} id={id} name={id} {...rest}>
        {children}
      </select>
      <ErrorMessages errors={errors} />
    </div>
  );
}
