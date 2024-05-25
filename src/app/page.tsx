import CollectionGrid from "@/components/CollectionGrid";
import ItemCard from "@/components/ItemCard";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <CollectionGrid>
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </CollectionGrid>
    </main>
  );
}
