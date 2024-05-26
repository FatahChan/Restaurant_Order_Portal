// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTableCreator,
  serial,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `order_portal_${name}`);

export const ItemsTable = createTable("items", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  price: decimal("price", { scale: 2 }).notNull().$type<number>(),
  description: text("description").default("").notNull(),
  image: text("image").notNull(),
  category_id: integer("category_id")
    .notNull()
    .references(() => CategoriesTable.id),
});

export const CategoriesTable = createTable("categories", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const OrdersTable = createTable("orders", {
  id: serial("id").primaryKey().notNull(),
  table: integer("table"),
  name: text("name").default("").notNull(),
});
export const OrderItemsTable = createTable("order_items", {
  id: serial("id").primaryKey().notNull(),
  order_id: integer("order_id")
    .notNull()
    .references(() => OrdersTable.id),
  item_id: integer("item_id")
    .notNull()
    .references(() => ItemsTable.id),
  quantity: integer("quantity").default(1).notNull(),
  notes: text("notes").default("").notNull(),
  status: text("status", { enum: ["pending", "served", "cancelled"] })
    .default("pending")
    .notNull(),
});

type ItemSelectType = InferSelectModel<typeof ItemsTable>;
type OrderSelectType = InferSelectModel<typeof OrdersTable>;
type OrderItemSelectType = InferSelectModel<typeof OrderItemsTable>;
type CategoriesTableType = InferSelectModel<typeof CategoriesTable>;

type ItemInsertType = InferInsertModel<typeof ItemsTable>;
type OrderInsertType = InferInsertModel<typeof OrdersTable>;
type OrderItemInsertType = InferInsertModel<typeof OrderItemsTable>;
type CategoriesInsertType = InferInsertModel<typeof CategoriesTable>;

export type {
  ItemSelectType,
  OrderSelectType,
  OrderItemSelectType,
  CategoriesTableType,
  ItemInsertType,
  OrderInsertType,
  OrderItemInsertType,
  CategoriesInsertType,
};
