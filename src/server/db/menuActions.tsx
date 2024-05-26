"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { ItemsTable } from "./schema";
import type { ItemSelectType, ItemInsertType } from "./schema";

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
        if (items.length === 0) {
          rejects(new Error("No items found"));
          return;
        }
        resolve(items);
      })
      .catch(() => {
        // TODO: add sentry logging
        rejects(new Error("Error retrieving the items"));
      });
  });
}

export async function createItem(item: ItemInsertType) {
  return new Promise<void>((resolve, rejects) => {
    db.insert(ItemsTable)
      .values({
        ...item,
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
