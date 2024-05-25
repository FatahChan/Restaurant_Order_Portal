import React from "react";

function CollectionGrid({ children }: { children: React.ReactNode }) {
  return (
    <section className=" flex flex-col gap-4">
      <h2 className="rounded-sm bg-black p-4 text-3xl font-semibold text-white">
        Collection
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">{children}</div>
    </section>
  );
}

export default CollectionGrid;
