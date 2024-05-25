// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `order-portal_${name}`);

export const ItemsTable = createTable(
  "items",
  {
    id: int("id").primaryKey({ autoIncrement: true }).notNull(),
    name: text("name").notNull(),
    price: int("price").notNull(),
    description: text("description").default("").notNull(),
    image: text("image").notNull(),
    category_id: int("category_id")
      .notNull()
      .references(() => CategoriesTable.id),
  },
  (table) => ({
    nameIdx: index("name").on(table.name),
  }),
);

export const CategoriesTable = createTable("categories", {
  id: int("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
});
export const OrdersTable = createTable("orders", {
  id: int("id").primaryKey({ autoIncrement: true }).notNull(),
  table: int("table"),
  name: text("name").default("").notNull(),
});
export const OrderItemsTable = createTable("order_items", {
  id: int("id").primaryKey({ autoIncrement: true }).notNull(),
  order_id: int("order_id")
    .notNull()
    .references(() => OrdersTable.id),
  item_id: int("item_id")
    .notNull()
    .references(() => ItemsTable.id),
  quantity: int("quantity").default(1).notNull(),
  notes: text("notes").default("").notNull(),
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
