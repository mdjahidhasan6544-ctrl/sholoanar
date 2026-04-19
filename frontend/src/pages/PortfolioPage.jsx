import { useMemo, useState } from "react";

import CategoryTabs from "../components/CategoryTabs";
import GalleryGrid from "../components/GalleryGrid";
import Lightbox from "../components/Lightbox";
import { useSiteData } from "../hooks/useSiteData";

export default function PortfolioPage() {
  const { loading, categories, images } = useSiteData();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredImages = useMemo(() => {
    if (activeCategory === "all") {
      return images;
    }

    return images.filter((image) => image.category?._id === activeCategory);
  }, [activeCategory, images]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-stone-950 text-stone-200">Loading gallery...</div>;
  }

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-bronze">Portfolio</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.94] text-white md:text-7xl">
              Weddings, events, portraits, and model studies framed with restraint.
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-stone-300 md:text-base">
            The gallery stays touch-friendly on mobile and spacious on desktop, with enough structure to guide the eye without reducing everything to a grid of identical tiles.
          </p>
        </div>
      </section>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      <section className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">Current selection</p>
            <p className="mt-2 font-display text-3xl text-white">
              {activeCategory === "all"
                ? "All work"
                : categories.find((category) => category._id === activeCategory)?.name}
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
            {filteredImages.length} frames
          </p>
        </div>
      </section>
      <GalleryGrid images={filteredImages} onSelect={setLightboxIndex} />
      <Lightbox
        images={filteredImages}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(direction) =>
          setLightboxIndex((current) =>
            current === null ? 0 : (current + direction + filteredImages.length) % filteredImages.length
          )
        }
      />
    </main>
  );
}
