import { useEffect, useState } from "react";

import { galleryApi } from "../api/services";
import { useAuth } from "../context/AuthContext";

const emptyAbout = {
  photographerName: "",
  tagline: "",
  bio: "",
  vision: "",
  contactEmail: "",
  instagramUrl: ""
};

export default function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [slider, setSlider] = useState({ items: [], autoplay: true });
  const [about, setAbout] = useState(emptyAbout);
  const [testimonials, setTestimonials] = useState([]);
  const [uploadForm, setUploadForm] = useState({ category: "", title: "", tags: "", files: [] });
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    const [
      statsResponse,
      categoriesResponse,
      imagesResponse,
      sliderResponse,
      contentResponse
    ] = await Promise.all([
      galleryApi.dashboard(),
      galleryApi.categories(),
      galleryApi.images(),
      galleryApi.slider(),
      galleryApi.content()
    ]);

    setStats(statsResponse.data.data.stats);
    setCategories(categoriesResponse.data.data.categories);
    setImages(imagesResponse.data.data.images);
    setSlider(sliderResponse.data.data.slider);
    setAbout(contentResponse.data.data.about);
    setTestimonials(contentResponse.data.data.testimonials);
  }

  useEffect(() => {
    loadDashboard().catch((error) => setMessage(error.response?.data?.error || "Failed to load admin data"));
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("category", uploadForm.category);
    formData.append("title", uploadForm.title);
    formData.append("tags", uploadForm.tags);
    Array.from(uploadForm.files).forEach((file) => formData.append("images", file));

    await galleryApi.uploadImages(formData);
    setMessage("Images uploaded");
    setUploadForm({ category: "", title: "", tags: "", files: [] });
    await loadDashboard();
  }

  async function handleCreateCategory(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await galleryApi.createCategory({
      name: formData.get("name"),
      description: formData.get("description")
    });
    event.currentTarget.reset();
    setMessage("Category added");
    await loadDashboard();
  }

  async function handleSaveAbout(event) {
    event.preventDefault();
    await galleryApi.updateAbout(about);
    setMessage("About content updated");
    await loadDashboard();
  }

  async function handleCreateTestimonial(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await galleryApi.createTestimonial({
      clientName: formData.get("clientName"),
      role: formData.get("role"),
      quote: formData.get("quote")
    });
    event.currentTarget.reset();
    setMessage("Testimonial added");
    await loadDashboard();
  }

  async function handleSliderToggle(imageId) {
    const normalizedItems = (slider.items || []).map((item, index) => ({
      image: item.image?._id || item.image,
      heading: item.heading,
      subheading: item.subheading,
      order: item.order ?? index
    }));
    const existing = normalizedItems.find((item) => item.image === imageId);
    const nextItems = existing
      ? normalizedItems.filter((item) => item.image !== imageId)
      : [
          ...normalizedItems,
          {
            image: imageId,
            heading: "Featured story",
            subheading: "Curated for the homepage slider.",
            order: normalizedItems.length
          }
        ];

    await galleryApi.updateSlider({ items: nextItems, autoplay: slider.autoplay });
    setMessage("Slider updated");
    await loadDashboard();
  }

  async function handleDeleteImage(id) {
    await galleryApi.deleteImage(id);
    setMessage("Image deleted");
    await loadDashboard();
  }

  async function handleDeleteTestimonial(id) {
    await galleryApi.deleteTestimonial(id);
    setMessage("Testimonial deleted");
    await loadDashboard();
  }

  return (
    <main className="min-h-screen bg-stone-950 px-5 py-28 text-stone-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-bronze">Admin panel</p>
            <h1 className="mt-4 font-display text-5xl text-white">Portfolio management</h1>
            <p className="mt-3 text-sm text-stone-400">Signed in as {user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/15 px-5 py-3 text-sm uppercase tracking-[0.22em] text-stone-300 transition hover:border-bronze hover:text-bronze"
          >
            Logout
          </button>
        </div>

        {message ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
            {message}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total images", value: stats?.totalImages || 0 },
            { label: "Categories", value: stats?.totalCategories || 0 },
            { label: "Slider items", value: stats?.sliderItems || 0 }
          ].map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{item.label}</p>
              <p className="mt-4 font-display text-5xl text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={handleUpload} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-3xl text-white">Upload images</h2>
            <div className="mt-6 space-y-4">
              <select
                required
                value={uploadForm.category}
                onChange={(event) => setUploadForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                value={uploadForm.title}
                onChange={(event) => setUploadForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Optional title"
                className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
              />
              <input
                value={uploadForm.tags}
                onChange={(event) => setUploadForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="Tags separated by commas"
                className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
              />
              <input
                required
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => setUploadForm((current) => ({ ...current, files: event.target.files }))}
                className="block w-full text-sm text-stone-400"
              />
            </div>
            <button className="mt-6 rounded-full bg-bronze px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
              Upload selection
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-3xl text-white">Gallery library</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {images.map((image) => {
                const inSlider = slider.items.some((item) => item.image?._id === image._id);

                return (
                  <article key={image._id} className="overflow-hidden rounded-[1.5rem] border border-white/10">
                    <img src={image.imageUrl} alt={image.title} className="h-48 w-full object-cover" />
                    <div className="space-y-3 p-4">
                      <div>
                        <p className="font-display text-2xl text-white">{image.title}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                          {image.category?.name}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSliderToggle(image._id)}
                          className="rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.2em] text-stone-300"
                        >
                          {inSlider ? "Remove from slider" : "Add to slider"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image._id)}
                          className="rounded-full border border-red-400/20 px-3 py-2 text-xs uppercase tracking-[0.2em] text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleCreateCategory} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-3xl text-white">New category</h2>
            <div className="mt-6 space-y-4">
              <input
                name="name"
                placeholder="Category name"
                required
                className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
              />
              <textarea
                name="description"
                placeholder="Description"
                rows="4"
                className="w-full rounded-[1.5rem] border border-white/10 bg-stone-950 px-4 py-3"
              />
            </div>
            <button className="mt-6 rounded-full bg-bronze px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
              Add category
            </button>
          </form>

          <form onSubmit={handleSaveAbout} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="font-display text-3xl text-white">About content</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(about).map(([key, value]) => (
                <label key={key} className={key === "bio" || key === "vision" ? "md:col-span-2" : ""}>
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">{key}</span>
                  {key === "bio" || key === "vision" ? (
                    <textarea
                      rows="5"
                      value={value}
                      onChange={(event) => setAbout((current) => ({ ...current, [key]: event.target.value }))}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-stone-950 px-4 py-3"
                    />
                  ) : (
                    <input
                      value={value}
                      onChange={(event) => setAbout((current) => ({ ...current, [key]: event.target.value }))}
                      className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
                    />
                  )}
                </label>
              ))}
            </div>
            <button className="mt-6 rounded-full bg-bronze px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
              Save about section
            </button>
          </form>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={handleCreateTestimonial} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-3xl text-white">New testimonial</h2>
            <div className="mt-6 space-y-4">
              <input
                name="clientName"
                placeholder="Client name"
                required
                className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
              />
              <input
                name="role"
                placeholder="Role"
                className="w-full rounded-full border border-white/10 bg-stone-950 px-4 py-3"
              />
              <textarea
                name="quote"
                placeholder="Quote"
                rows="5"
                required
                className="w-full rounded-[1.5rem] border border-white/10 bg-stone-950 px-4 py-3"
              />
            </div>
            <button className="mt-6 rounded-full bg-bronze px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
              Add testimonial
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-3xl text-white">Testimonials</h2>
            <div className="mt-6 space-y-4">
              {testimonials.map((item) => (
                <div key={item._id} className="rounded-[1.5rem] border border-white/10 p-5">
                  <p className="font-display text-2xl text-white">“{item.quote}”</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-stone-400">
                    {item.clientName} {item.role ? `• ${item.role}` : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(item._id)}
                    className="mt-4 rounded-full border border-red-400/20 px-3 py-2 text-xs uppercase tracking-[0.2em] text-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
