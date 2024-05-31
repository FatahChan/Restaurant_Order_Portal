import CollectionGrid from "@/components/CategoryGrid";
import ItemCard from "@/components/ItemCard";
import { getItems } from "@/server/db/menuActions";

export default async function HomePage() {
  const items = await getItems();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <CollectionGrid>
        {items.map((item) => (
          <ItemCard key={item.id} />
        ))}
      </CollectionGrid> */}
    </main>
  );
}
