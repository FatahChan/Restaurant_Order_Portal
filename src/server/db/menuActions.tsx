"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { CategoriesTable, ItemsTable } from "./schema";
import snakeCase from "lodash.snakecase";
import type {
  ItemSelectType,
  ItemInsertType,
  CategoriesTableType,
} from "./schema";

export async function getItem(id: number) {
  return new Promise<ItemSelectType>((resolve, rejects) => {
    db.query.ItemsTable.findFirst({
      where: eq(ItemsTable.id, id),
    })
      .then((item) => {
        if (!item) {
          rejects(new Error("Item not found"));
          return;
        }
        resolve(item);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the item"));
      });
  });
}

export async function getItems() {
  return new Promise<ItemSelectType[]>((resolve, rejects) => {
    db.query.ItemsTable.findMany()
      .then((items) => {
        resolve(items);
      })
      .catch(() => {
        // TODO: add sentry logging
        rejects(new Error("Error retrieving the items"));
      });
  });
}
export async function doesItemExistBySlug(slug: string) {
  return new Promise<boolean>((resolve, rejects) => {
    db.query.ItemsTable.findFirst({
      where: eq(ItemsTable.slug, slug),
    })
      .then((item) => {
        if (!item) {
          resolve(false);
          return;
        }
        resolve(true);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the item"));
      });
  });
}
export async function getItemBySlug(slug: string) {
  return new Promise<{
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string;
    category_id: number;
  }>((resolve, rejects) => {
    db.query.ItemsTable.findFirst({
      where: eq(ItemsTable.slug, slug),
    })
      .then((item) => {
        if (!item) {
          rejects(new Error("Item not found"));
          return;
        }
        resolve(item);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the item"));
      });
  });
}
export async function addItem(item: Omit<ItemInsertType, "slug">) {
  return new Promise<void>((resolve, rejects) => {
    db.insert(ItemsTable)
      .values({
        ...item,
        slug: snakeCase(item.name),
      })
      .then(() => resolve())
      .catch(() => {
        rejects(new Error("Error creating the item"));
      });
  });
}

export async function updateItem(id: number, item: ItemInsertType) {
  return new Promise<void>((resolve, rejects) => {
    db.update(ItemsTable)
      .set(item)
      .where(eq(ItemsTable.id, id))
      .then(() => {
        resolve();
      })
      .catch(() => {
        rejects(new Error("Error updating the item"));
      });
  });
}

export async function deleteItem(id: number) {
  return new Promise<void>((resolve, rejects) => {
    db.delete(ItemsTable)
      .where(eq(ItemsTable.id, id))
      .then(() => {
        resolve();
      })
      .catch(() => {
        rejects(new Error("Error deleting the item"));
      });
  });
}

export async function addCategory(name: string) {
  return new Promise<void>((resolve, rejects) => {
    db.insert(CategoriesTable)
      .values({
        name,
        slug: snakeCase(name),
      })
      .then(() => resolve())
      .catch(() => {
        rejects(new Error("Error creating the category"));
      });
  });
}
export async function getCategories() {
  return new Promise<CategoriesTableType[]>((resolve, rejects) => {
    db.query.CategoriesTable.findMany()
      .then((categories) => {
        resolve(categories);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the categories"));
      });
  });
}

export async function getCategoriesWithItems() {
  return new Promise<
    {
      name: string;
      id: number;
      slug: string;
      items: {
        name: string;
        id: number;
        slug: string;
        price: number;
        description: string;
        image: string;
        category_id: number;
      }[];
    }[]
  >((resolve, rejects) => {
    db.query.CategoriesTable.findMany({
      with: {
        items: true,
      },
    })
      .then((categories) => {
        resolve(categories);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the categories"));
      });
  });
}
export async function getItemsByCategory(categoryId: number) {
  return new Promise<ItemSelectType[]>((resolve, rejects) => {
    db.query.ItemsTable.findMany({
      where: eq(ItemsTable.category_id, categoryId),
    })
      .then((items) => {
        if (items.length === 0) {
          rejects(new Error("No items found"));
          return;
        }
        resolve(items);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the items"));
      });
  });
}

export async function doesCategoryExistBySlug(slug: string) {
  return new Promise<boolean>((resolve, rejects) => {
    db.query.CategoriesTable.findFirst({
      where: eq(CategoriesTable.slug, slug),
    })
      .then((category) => {
        if (!category) {
          resolve(false);
          return;
        }
        resolve(true);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the category"));
      });
  });
}
