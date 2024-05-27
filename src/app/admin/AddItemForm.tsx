import React from "react";
import { getCategories } from "@/server/db/menuActions";
import { createClient } from "@/server/supabase";

export async function AddItemForm() {
  const collections = await getCategories();
  const handleAddItem = async (formData: FormData) => {
    "use server";
    const name = formData.get("name");
    const price = formData.get("price");
    const category_id = Number(formData.get("category") ?? "1");
    const description = formData.get("description");
    const image = formData.get("image");
    if (
      typeof name !== "string" ||
      typeof price !== "string" ||
      typeof category_id !== "number" ||
      typeof description !== "string" ||
      image === null
    ) {
      return new Error("Invalid form data");
    }
    const bucket = "items";
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(name, image);

    if (error) {
      return { error };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("items").getPublicUrl(data.path);
    return publicUrl;

    // await addItem({
    //   name,
    //   price: Number(price),
    //   category_id,
    //   description,
    //   image: publicUrl,
    // });
  };
  return (
    <form
      action={handleAddItem}
      className="mx-auto flex w-96 max-w-full flex-col gap-5"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add a new item
      </h1>
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Item name
        </label>
        <input
          type="name"
          id="name"
          name="name"
          placeholder="dish 1"
          required
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Price
        </label>
        <input
          type="number"
          placeholder="1.0"
          inputMode="decimal"
          min="0"
          step="0.01"
          id="price"
          name="price"
          required
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Category
        </label>
        <select id="category" name="category">
          {collections.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          name="description"
          placeholder="Description"
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Image
        </label>
        <input type="file" id="image" name="image" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
