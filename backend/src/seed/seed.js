require("dotenv").config();

const connectDatabase = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const About = require("../models/About");
const Image = require("../models/Image");
const Slider = require("../models/Slider");
const Testimonial = require("../models/Testimonial");
const slugify = require("../utils/slugify");

const categoryNames = ["Weddings", "Events", "Portraits", "Models"];
const sampleImages = [
  {
    category: "Weddings",
    title: "Candlelit vows",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    tags: ["wedding", "ceremony", "cinematic"]
  },
  {
    category: "Events",
    title: "Reception atmosphere",
    imageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80",
    tags: ["event", "night", "celebration"]
  },
  {
    category: "Portraits",
    title: "Quiet study",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=80",
    tags: ["portrait", "editorial"]
  },
  {
    category: "Models",
    title: "Editorial motion",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    tags: ["fashion", "model", "editorial"]
  },
  {
    category: "Weddings",
    title: "After-ceremony stillness",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
    tags: ["wedding", "couple"]
  },
  {
    category: "Portraits",
    title: "Window light portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1600&q=80",
    tags: ["portrait", "light"]
  }
];
const sampleTestimonials = [
  {
    clientName: "Nadia & Sami",
    role: "Wedding clients",
    quote: "The final gallery felt quiet, cinematic, and completely ours."
  },
  {
    clientName: "Raina",
    role: "Portrait client",
    quote: "Every frame looked editorial without feeling distant or overworked."
  }
];

async function run() {
  await connectDatabase();

  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD are required");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      password,
      name: "Admin",
      role: "admin"
    });
  }

  for (const [index, name] of categoryNames.entries()) {
    await Category.findOneAndUpdate(
      { slug: slugify(name) },
      { name, slug: slugify(name), order: index },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await About.findOneAndUpdate(
    {},
    {
      photographerName: "Sholo Anar Chobi",
      tagline: "𝑭𝒓𝒂𝒎𝒆𝒔 𝒃𝒆𝒚𝒐𝒏𝒅 𝒘𝒐𝒓𝒅𝒔",
      bio: "Sholo Anar Chobi captures people, celebrations, and motion with a premium photography and cinematography approach built around atmosphere, emotion, and detail.",
      vision: "Each frame is shaped to hold memory beyond language, with quiet compositions, rich tones, and a cinematic sense of presence.",
      dmNote: "DM for shoot and other queries.",
      phone: "01517053820",
      tiktokUrl: "https://www.tiktok.com/@sholo.anar.chobi",
      facebookUrl: "https://www.facebook.com/SholoAnarChobi",
      instagramUrl: "https://www.instagram.com/sholo_anar_chobi/"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const categories = await Category.find();
  const categoryMap = new Map(categories.map((category) => [category.name, category]));

  for (const [index, image] of sampleImages.entries()) {
    const category = categoryMap.get(image.category);

    if (!category) {
      continue;
    }

    await Image.findOneAndUpdate(
      { title: image.title },
      {
        title: image.title,
        category: category._id,
        tags: image.tags,
        imageUrl: image.imageUrl,
        publicId: `seed-${slugify(image.title)}`,
        width: 1600,
        height: 1200,
        featured: index < 4,
        sortOrder: index
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const testimonial of sampleTestimonials) {
    await Testimonial.findOneAndUpdate(
      { clientName: testimonial.clientName, quote: testimonial.quote },
      testimonial,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const sliderImages = await Image.find({ featured: true }).sort({ sortOrder: 1 }).limit(4);
  await Slider.findOneAndUpdate(
    {},
    {
      autoplay: true,
      items: sliderImages.map((image, index) => ({
        image: image._id,
        heading: image.title,
        subheading: "Frames beyond words, built for premium photography and cinematography.",
        order: index
      }))
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Seed completed for ${user.email}`);
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
