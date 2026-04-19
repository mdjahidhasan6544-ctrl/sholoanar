import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

export default function Lightbox({ images, activeIndex, onClose, onNavigate }) {
  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft") {
        onNavigate(-1);
      }
      if (event.key === "ArrowRight") {
        onNavigate(1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClose, onNavigate]);

  const image = activeIndex === null ? null : images[activeIndex];

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full border border-white/15 p-3 text-white"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            className="absolute left-5 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/15 p-3 text-white md:block"
          >
            <ChevronLeft size={18} />
          </button>
          <motion.img
            key={image._id}
            src={image.imageUrl}
            alt={image.title}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="max-h-full max-w-full rounded-[2rem] object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
            <div>
              <p className="font-display text-3xl text-white">{image.title}</p>
              <p className="text-sm text-stone-400">{image.category?.name}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="rounded-full border border-white/15 p-3 text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
