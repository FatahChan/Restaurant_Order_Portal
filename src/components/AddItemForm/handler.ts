"use server";
import { doesItemExistBySlug, addItem } from "@/server/db/menuActions";
import { upload } from "@/server/supabase/actions";
import snakeCase from "lodash.snakecase";
import { revalidatePath } from "next/cache";
import { z, type ZodIssue } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3)
    .refine(
      async (value) => {
        try {
          const response = await doesItemExistBySlug(snakeCase(value));
          return !response;
        } catch (e) {
          return false;
        }
      },
      {
        message: "Item already exists",
      },
    ),
  price: z.number().min(0),
  description: z.string().optional(),
  category: z.number(),
  image: z.custom<File>((value) => value !== null),
});

export async function handleAddItem(
  _preState: unknown,
  formData: FormData,
): Promise<{ errors: ZodIssue[]; success: boolean }> {
  const name = formData.get("name");
  const price = formData.get("price");
  const description = formData.get("description");
  const category = formData.get("category");
  const image = formData.get("image");

  const { data, error } = await formSchema.safeParseAsync({
    name,
    price,
    description,
    category,
    image,
  });

  if (error) {
    return { errors: error.issues, success: false };
  }

  const uploadResponse = await upload({
    bucket: "items",
    name: data.name,
    file: data.image,
    fileOptions: {
      upsert: true,
    },
  });
  if (uploadResponse.data === null) {
    return {
      errors: [
        { message: uploadResponse.error, path: ["image"], code: "custom" },
      ],
      success: false,
    };
  }

  const item = {
    name: data.name,
    price: data.price,
    description: data.description,
    category_id: data.category,
    image: uploadResponse.data,
  };

  await addItem(item);
  revalidatePath("/admin");
  return { errors: [], success: true };
}
