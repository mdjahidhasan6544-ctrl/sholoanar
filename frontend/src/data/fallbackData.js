export const fallbackCategories = [
  { _id: "weddings", name: "Weddings", slug: "weddings" },
  { _id: "events", name: "Events", slug: "events" },
  { _id: "portraits", name: "Portraits", slug: "portraits" },
  { _id: "models", name: "Models", slug: "models" }
];

export const fallbackImages = [
  {
    _id: "1",
    title: "Ceremony hush",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    category: fallbackCategories[0],
    tags: ["wedding", "cinematic"]
  },
  {
    _id: "2",
    title: "Reception glow",
    imageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    category: fallbackCategories[1],
    tags: ["event", "night"]
  },
  {
    _id: "3",
    title: "Quiet portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    category: fallbackCategories[2],
    tags: ["portrait"]
  },
  {
    _id: "4",
    title: "Editorial frame",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    category: fallbackCategories[3],
    tags: ["model", "fashion"]
  }
];

export const fallbackSlider = {
  autoplay: true,
  items: fallbackImages.map((image, index) => ({
    image,
    heading: ["Quiet light", "Modern ceremonies", "Faces with gravity", "Editorial motion"][index],
    subheading: "Frames beyond words, built for premium photography and cinematography.",
    order: index
  }))
};

export const fallbackContent = {
  about: {
    photographerName: "Sholo Anar Chobi",
    tagline: "𝑭𝒓𝒂𝒎𝒆𝒔 𝒃𝒆𝒚𝒐𝒏𝒅 𝒘𝒐𝒓𝒅𝒔",
    bio: "Sholo Anar Chobi captures people, celebrations, and motion with a premium photography and cinematography approach built around atmosphere, emotion, and detail.",
    vision: "Each frame is shaped to hold memory beyond language, with quiet compositions, rich tones, and a cinematic sense of presence.",
    dmNote: "DM for shoot and other queries.",
    phone: "01517053820",
    contactEmail: "",
    tiktokUrl: "https://www.tiktok.com/@sholo.anar.chobi",
    facebookUrl: "https://www.facebook.com/SholoAnarChobi",
    instagramUrl: "https://www.instagram.com/sholo_anar_chobi/"
  },
  testimonials: [
    {
      _id: "t1",
      clientName: "Nadia & Sami",
      role: "Wedding clients",
      quote: "The gallery felt cinematic without losing the softness of the day."
    },
    {
      _id: "t2",
      clientName: "Raina",
      role: "Portrait client",
      quote: "Every image felt intentional. Nothing looked generic or overproduced."
    }
  ]
};
