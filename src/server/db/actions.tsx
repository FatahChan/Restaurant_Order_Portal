"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { ItemsTable, OrderItemsTable, OrdersTable } from "./schema";
import type {
  OrderSelectType,
  OrderInsertType,
  ItemSelectType,
  ItemInsertType,
} from "./schema";

export async function getOrder(id: number) {
  return new Promise<OrderSelectType>((resolve, rejects) => {
    db.query.OrdersTable.findFirst({
      where: eq(OrdersTable.id, id),
    })
      .then((order) => {
        if (!order) {
          rejects(new Error("Order not found"));
          return;
        }
        resolve(order);
      })
      .catch(() => {
        rejects(new Error("Error retrieving the order"));
      });
  });
}

export async function getOrders() {
  return new Promise<OrderSelectType[]>((resolve, rejects) => {
    db.query.OrdersTable.findMany()
      .then((orders) => {
        if (orders.length === 0) {
          rejects(new Error("No orders found"));
          return;
        }
        resolve(orders);
      })
      .catch(() => {
        // TODO: add sentry logging
        rejects(new Error("Error retrieving the orders"));
      });
  });
}

export async function createOrder(order?: OrderInsertType) {
  return new Promise<{ id: number }>((resolve, rejects) => {
    db.insert(OrdersTable)
      .values({
        ...order,
      })

      .then((order) => {
        if (order) {
          rejects(new Error("Error creating the order"));
          return;
        }
        resolve(order);
      })
      .catch(() => {
        // TODO: add sentry logging
        rejects(new Error("Error creating the order"));
      });
  });
}

export async function updateOrder(id: number, order: OrderInsertType) {
  return new Promise<void>((resolve, rejects) => {
    db.update(OrdersTable)
      .set(order)
      .where(eq(OrdersTable.id, id))
      .then(() => {
        resolve();
      })
      .catch(() => {
        // TODO: add sentry logging
        rejects(new Error("Error updating the order"));
      });
  });
}

export async function deleteOrder(id: number) {
  return new Promise<void>((resolve, rejects) => {
    db.delete(OrdersTable)
      .where(eq(OrdersTable.id, id))
      .then(() => {
        resolve();
      })
      .catch(() => {
        rejects(new Error("Error deleting the order"));
      });
  });
}

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

export async function getItemsWithTotalByOrder(orderId: number) {
  return new Promise<{
    items: {
      id: number;
      name: string;
      price: number;
      description: string;
      notes: string;
      quantity: number;
      table: number | null;
    }[];
    total: number;
  }>((resolve, rejects) => {
    db.select({
      id: ItemsTable.id,
      order_id: OrderItemsTable.order_id,
      name: ItemsTable.name,
      price: ItemsTable.price,
      description: ItemsTable.description,
      notes: OrderItemsTable.notes,
      quantity: OrderItemsTable.quantity,
      table: OrdersTable.table,
    })
      .from(ItemsTable)
      .innerJoin(OrderItemsTable, eq(ItemsTable.id, OrderItemsTable.item_id))
      .innerJoin(OrdersTable, eq(OrdersTable.id, OrderItemsTable.order_id))
      .where(eq(OrdersTable.id, orderId))
      .then((items) => {
        if (items.length === 0) {
          rejects(new Error("No items found"));
          return;
        }
        resolve({
          items,
          total: items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          ),
        });
      })
      .catch(() => {
        rejects(new Error("Error retrieving the items"));
      });
  });
}
