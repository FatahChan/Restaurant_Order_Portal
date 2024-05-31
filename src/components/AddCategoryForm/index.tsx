"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { handleAddCategory } from "./handler";
import { useFormState } from "react-dom";
import { Input } from "../ui/input";
import { findErrors } from "../ui/formErrorMessages";
import { SubmitButton } from "../ui/submitButton";

export function AddCategoryForm({
  className,
  ...rest
}: React.HTMLProps<HTMLFormElement>) {
  const [state, addItemFormAction] = useFormState(handleAddCategory, {
    errors: [],
    success: false,
  });
  return (
    <form
      action={addItemFormAction}
      className={cn("mx-auto flex w-96 max-w-full flex-col gap-5", className)}
      {...rest}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add a new category
      </h1>
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Category name
        </label>
        <Input
          id="name"
          label="name"
          required
          minLength={3}
          errors={findErrors("name", state.errors)}
        />
      </div>
      <SubmitButton>Submit</SubmitButton>
    </form>
  );
}
