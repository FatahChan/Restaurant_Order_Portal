import React from "react";

function CategoryGrid({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) {
  const isTitleString = typeof title === "string";

  return (
    <section className=" flex flex-col gap-4">
      {isTitleString ? (
        <h2 className="rounded-sm bg-black p-4 text-3xl font-semibold text-white">
          {title}
        </h2>
      ) : (
        title
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">{children}</div>
    </section>
  );
}

export default CategoryGrid;
