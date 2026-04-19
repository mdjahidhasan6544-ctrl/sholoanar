import client from "./client";

export const authApi = {
  login: (payload) => client.post("/auth/login", payload),
  logout: () => client.post("/auth/logout"),
  me: () => client.get("/auth/me")
};

export const galleryApi = {
  images: (category) => client.get("/images", { params: category ? { category } : {} }),
  uploadImages: (formData) => client.post("/images/upload", formData),
  updateImage: (id, payload) => client.put(`/images/${id}`, payload),
  deleteImage: (id) => client.delete(`/images/${id}`),
  categories: () => client.get("/categories"),
  createCategory: (payload) => client.post("/categories", payload),
  slider: () => client.get("/slider"),
  updateSlider: (payload) => client.put("/slider", payload),
  content: () => client.get("/content"),
  dashboard: () => client.get("/content/dashboard"),
  updateAbout: (payload) => client.put("/content/about", payload),
  createTestimonial: (payload) => client.post("/content/testimonials", payload),
  updateTestimonial: (id, payload) => client.put(`/content/testimonials/${id}`, payload),
  deleteTestimonial: (id) => client.delete(`/content/testimonials/${id}`)
};
