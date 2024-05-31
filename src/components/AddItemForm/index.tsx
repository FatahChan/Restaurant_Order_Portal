"use client";
import React from "react";
import { useFormState } from "react-dom";
import { handleAddItem } from "./handler";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesWithItems } from "@/server/db/menuActions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { findErrors } from "../ui/formErrorMessages";
import { SubmitButton } from "../ui/submitButton";

function AddItemForm({ className, ...rest }: React.HTMLProps<HTMLFormElement>) {
  const [state, addItemFormAction] = useFormState(handleAddItem, {
    errors: [],
    success: false,
  });

  const { data: categories, isFetched } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesWithItems,
  });
  return (
    <form
      action={addItemFormAction}
      className={cn("mx-auto flex w-96 max-w-full flex-col gap-5", className)}
      {...rest}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add a new item
      </h1>
      <Input
        label="Name"
        id="name"
        errors={findErrors("name", state.errors)}
        minLength={3}
        required
      />
      <Input
        label="price"
        id="price"
        type="number"
        inputMode="decimal"
        min={0}
        errors={findErrors("name", state.errors)}
        required
      />
      <Input
        label="Description"
        id="description"
        errors={findErrors("description", state.errors)}
      />
      <Select
        label="Category"
        id="category"
        errors={findErrors("category", state.errors)}
        required
      >
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        )) ?? <option value="-1">Please add a category first</option>}
      </Select>
      <Input
        label="Image"
        id="image"
        type="file"
        errors={findErrors("image", state.errors)}
        required
      />
      <SubmitButton disabled={!isFetched || !categories}>Submit</SubmitButton>
    </form>
  );
}

export default AddItemForm;
