"use server";

import { addCategory, doesCategoryExistBySlug } from "@/server/db/menuActions";
import snakeCase from "lodash.snakecase";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3)
    .refine(
      async (value) => {
        try {
          const response = await doesCategoryExistBySlug(snakeCase(value));
          return !response;
        } catch (e) {
          return false;
        }
      },
      { message: "Category already exists" },
    ),
});

export async function handleAddCategory(
  _preState: unknown,
  formData: FormData,
) {
  const name = formData.get("name");
  const { data, error } = await formSchema.safeParseAsync({
    name,
  });
  if (error) {
    return { errors: error.issues, success: false };
  }
  await addCategory(data.name);
  revalidatePath("/admin");
  return { errors: [], success: true };
}
