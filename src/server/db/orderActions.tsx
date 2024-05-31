"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { ItemsTable, OrderItemsTable, OrdersTable } from "./schema";
import type { OrderSelectType, OrderInsertType } from "./schema";

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

// export async function getItemsWithTotalByOrder(orderId: number) {
//   return new Promise<{
//     items: {
//       id: number;
//       name: string;
//       price: number;
//       description: string;
//       notes: string;
//       quantity: number;
//       table: number | null;
//       status: "pending" | "served" | "cancelled";
//     }[];
//     total: number;
//   }>((resolve, rejects) => {
//     db.select({
//       id: ItemsTable.id,
//       order_id: OrderItemsTable.order_id,
//       name: ItemsTable.name,
//       price: ItemsTable.price,
//       description: ItemsTable.description,
//       notes: OrderItemsTable.notes,
//       quantity: OrderItemsTable.quantity,
//       status: OrderItemsTable.status,
//       table: OrdersTable.table,
//     })
//       .from(ItemsTable)
//       .innerJoin(OrderItemsTable, eq(ItemsTable.id, OrderItemsTable.item_id))
//       .innerJoin(OrdersTable, eq(OrdersTable.id, OrderItemsTable.order_id))
//       .where(eq(OrdersTable.id, orderId))
//       .then((items) => {
//         if (items.length === 0) {
//           rejects(new Error("No items found"));
//           return;
//         }
//         resolve({
//           items,
//           total: items.reduce(
//             (acc, item) =>
//               acc +
//               item.price * item.quantity * (item.status === "served" ? 1 : 0),
//             0,
//           ),
//         });
//       })
//       .catch(() => {
//         rejects(new Error("Error retrieving the items"));
//       });
//   });
// }

export async function getOrderWithItemsTotal(orderId: number) {
  return new Promise((resolve, rejects) => {
    db.query.OrdersTable.findFirst({
      with: {
        items: {
          with: {
            item: {
              columns: {
                price: true,
                name: true,
              },
            },
          },
        },
      },

      where: eq(OrdersTable.id, orderId),
    })
      .then((order) => {
        if (!order) {
          rejects(new Error("Order not found"));
          return;
        }

        const total = order.items.reduce((acc, item) => {
          if (item.item === null) {
            throw new Error("Item not found" + item.id);
          }
          return (
            acc +
            item.item.price * item.quantity * (item.status === "served" ? 1 : 0)
          );
        }, 0);
        const orderItems = {
          ...order,
          items: order.items.map((item) => ({
            order_item_id: item.id,
            name: item.item!.name,
            quantity: item.quantity,
            status: item.status,
            notes: item.notes,
            price: item.item!.price,
          })),
        };

        resolve({ ...orderItems, total });
      })

      .catch(() => {
        rejects(new Error("Error retrieving the order"));
      });
  });
}
