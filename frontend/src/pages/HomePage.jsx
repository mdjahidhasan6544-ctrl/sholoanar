import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import HeroSlider from "../components/HeroSlider";
import { useSiteData } from "../hooks/useSiteData";

export default function HomePage() {
  const { loading, slider, content, images, error } = useSiteData();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-stone-950 text-stone-200">Loading portfolio...</div>;
  }

  const about = content?.about;
  const testimonials = content?.testimonials || [];
  const highlights = images.slice(0, 4);
  const strip = images.slice(0, 3);

  return (
    <main>
      {error ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
          {error}
        </div>
      ) : null}

      <HeroSlider
        slider={slider}
        photographerName={about?.photographerName}
        tagline={about?.tagline}
      />

      <section className="border-t border-white/10 bg-stone-950 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-bronze">Selected work</p>
              <h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.96] text-white md:text-7xl">
                One visual idea per section, with the image always in front.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-stone-300 md:text-base">
                Weddings stay intimate, portraits stay quiet, and events keep their energy without turning the layout into a collage of widgets.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {strip.map((image) => (
                <div key={`${image._id}-strip`} className="overflow-hidden rounded-[1.6rem] border border-white/10">
                  <img src={image.imageUrl} alt={image.title} className="h-56 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {highlights.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className={`overflow-hidden rounded-[2rem] border border-white/10 ${
                  index === 0 || index === 3 ? "md:translate-y-10" : ""
                }`}
              >
                <img src={image.imageUrl} alt={image.title} className="h-80 w-full object-cover" />
                <div className="border-t border-white/10 bg-black/30 p-5">
                  <p className="font-display text-3xl text-white">{image.title}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-stone-400">
                    {image.category?.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#09090b_0%,#17120d_100%)] py-24">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-bronze/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.42em] text-bronze">About</p>
            <h2 className="max-w-3xl font-display text-5xl leading-[0.95] text-white md:text-7xl">
              {about?.tagline}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-stone-300 md:text-base">{about?.bio}</p>
            <p className="max-w-xl text-sm leading-7 text-stone-400 md:text-base">{about?.vision}</p>
            <div className="space-y-3 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{about?.dmNote}</p>
              <p className="text-sm uppercase tracking-[0.22em] text-stone-200">
                For Premium Photography & Cinematography: {about?.phone}
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-stone-400">
                {about?.tiktokUrl ? (
                  <a
                    href={about.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-bronze hover:text-bronze"
                  >
                    TikTok
                  </a>
                ) : null}
                {about?.facebookUrl ? (
                  <a
                    href={about.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-bronze hover:text-bronze"
                  >
                    Facebook
                  </a>
                ) : null}
                {about?.instagramUrl ? (
                  <a
                    href={about.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-bronze hover:text-bronze"
                  >
                    Instagram
                  </a>
                ) : null}
              </div>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 rounded-full border border-bronze/50 px-5 py-3 text-sm uppercase tracking-[0.22em] text-bronze transition hover:bg-bronze hover:text-stone-950"
            >
              Explore full gallery <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-8">
            {testimonials.map((item) => (
              <blockquote key={item._id} className="border-t border-white/10 pt-6">
                <p className="font-display text-3xl leading-tight text-white">"{item.quote}"</p>
                <footer className="mt-3 text-sm uppercase tracking-[0.18em] text-stone-400">
                  {item.clientName} {item.role ? `• ${item.role}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
