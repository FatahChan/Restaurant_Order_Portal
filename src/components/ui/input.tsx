"use client";
import React from "react";
import { ErrorMessages } from "./formErrorMessages";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  id: string;
  errors: string[];
}
export function Input({ label, id, errors, ...rest }: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input type={id} id={id} name={id} {...rest} />
      <ErrorMessages errors={errors} />
    </div>
  );
}
