import React from "react";

import AddItemForm from "../../components/AddItemForm";
import { AddCategoryForm } from "../../components/AddCategoryForm";
import { getCategoriesWithItems } from "@/server/db/menuActions";
import CollectionGrid from "@/components/CategoryGrid";
import ItemCard from "@/components/ItemCard";
async function Admin() {
  const categories = await getCategoriesWithItems();
  return (
    <>
      <div className="mx-auto flex justify-center gap-5 p-6">
        <AddCategoryForm className="mx-0" />
        <AddItemForm className="mx-0" />
      </div>
      <div className="container">
        {categories.map((category) => (
          <CollectionGrid key={category.id} title={category.name}>
            {category.items.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </CollectionGrid>
        ))}
      </div>
    </>
  );
}

export default Admin;
