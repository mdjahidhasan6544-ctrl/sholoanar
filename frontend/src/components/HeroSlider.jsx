import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSlider({ slider, photographerName, tagline }) {
  const items = slider?.items || [];
  const autoplay = slider?.autoplay ?? true;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || items.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [autoplay, items.length]);

  if (!items.length) {
    return null;
  }

  const active = items[index];

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-stone-950">
      <AnimatePresence mode="wait">
        <motion.img
          key={active.image?.imageUrl || index}
          src={active.image?.imageUrl}
          alt={active.heading || photographerName}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/25 to-black/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,147,95,0.22),transparent_28%)]" />
      <div className="absolute inset-y-0 right-0 w-[44%] bg-gradient-to-l from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end"
        >
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.45em] text-bronze">Photography portfolio</p>
            <h1 className="max-w-4xl font-display text-[4.5rem] leading-[0.88] text-white sm:text-[5.5rem] md:text-[7rem] lg:text-[8.5rem]">
              {photographerName}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/portfolio"
                className="inline-flex rounded-full bg-bronze px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-950 transition hover:opacity-90"
              >
                View portfolio
              </Link>
              <p className="max-w-lg text-sm leading-7 text-stone-300 md:text-base">
                {active.subheading || tagline}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="hidden border-l border-white/10 pl-6 lg:block"
          >
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">Current frame</p>
            <p className="mt-3 font-display text-4xl leading-none text-white">{active.heading}</p>
            <p className="mt-4 text-sm leading-7 text-stone-400">{tagline}</p>
          </motion.div>
        </motion.div>

        <div className="grid gap-8 border-t border-white/10 pt-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-5 overflow-x-auto">
            {items.map((item, itemIndex) => (
              <button
                key={`${item.image?._id || itemIndex}-dot`}
                type="button"
                onClick={() => setIndex(itemIndex)}
                className="min-w-0 text-left"
                aria-label={`Slide ${itemIndex + 1}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-1.5 rounded-full transition ${
                      itemIndex === index ? "w-12 bg-bronze" : "w-5 bg-white/25"
                    }`}
                  />
                  <span
                    className={`text-[11px] uppercase tracking-[0.28em] transition ${
                      itemIndex === index ? "text-white" : "text-stone-500"
                    }`}
                  >
                    {String(itemIndex + 1).padStart(2, "0")} {item.heading}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="hidden gap-3 md:flex md:justify-self-end">
            <button
              type="button"
              onClick={() => setIndex((current) => (current - 1 + items.length) % items.length)}
              className="rounded-full border border-white/20 p-3 text-white transition hover:border-bronze hover:text-bronze"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((current) => (current + 1) % items.length)}
              className="rounded-full border border-white/20 p-3 text-white transition hover:border-bronze hover:text-bronze"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
