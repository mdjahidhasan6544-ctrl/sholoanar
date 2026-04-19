export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="sticky top-[92px] z-30 overflow-x-auto border-y border-white/10 bg-stone-950/90 px-5 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl gap-3">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em] transition ${
            activeCategory === "all"
              ? "bg-bronze text-stone-950"
              : "border border-white/15 bg-white/[0.03] text-stone-300 hover:border-bronze hover:text-bronze"
          }`}
        >
          All work
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => onChange(category._id)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em] transition ${
              activeCategory === category._id
                ? "bg-bronze text-stone-950"
                : "border border-white/15 bg-white/[0.03] text-stone-300 hover:border-bronze hover:text-bronze"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
