import { motion } from "framer-motion";

export default function GalleryGrid({ images, onSelect }) {
  return (
    <div className="columns-1 gap-4 px-5 py-12 sm:columns-2 md:px-8 lg:columns-3 xl:columns-4">
      {images.map((image, index) => (
        <motion.button
          key={image._id}
          type="button"
          onClick={() => onSelect(index)}
          className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 text-left shadow-halo"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, delay: index * 0.03 }}
        >
          <img
            src={image.imageUrl}
            alt={image.title}
            loading="lazy"
            className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
          <div className="flex items-end justify-between gap-4 p-5">
            <div>
              <p className="font-display text-3xl leading-none text-white">{image.title}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-stone-400">
                {image.category?.name || "Portfolio"}
              </p>
            </div>
            <div className="text-right text-[11px] uppercase tracking-[0.18em] text-stone-500">
              {(image.tags || []).slice(0, 2).join(" / ")}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
