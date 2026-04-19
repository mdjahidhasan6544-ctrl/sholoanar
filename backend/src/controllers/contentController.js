const asyncHandler = require("express-async-handler");

const About = require("../models/About");
const Testimonial = require("../models/Testimonial");
const Image = require("../models/Image");
const Category = require("../models/Category");
const Slider = require("../models/Slider");
const { successResponse } = require("../utils/responses");

async function getOrCreateAbout() {
  let about = await About.findOne();

  if (!about) {
    about = await About.create({});
  }

  return about;
}

const getSiteContent = asyncHandler(async (_req, res) => {
  const [about, testimonials] = await Promise.all([
    getOrCreateAbout(),
    Testimonial.find({ featured: true }).sort({ createdAt: -1 })
  ]);

  return successResponse(res, { about, testimonials });
});

const updateAbout = asyncHandler(async (req, res) => {
  const about = await getOrCreateAbout();

  [
    "photographerName",
    "tagline",
    "bio",
    "vision",
    "dmNote",
    "phone",
    "contactEmail",
    "tiktokUrl",
    "facebookUrl",
    "instagramUrl"
  ].forEach((key) => {
    if (typeof req.body[key] === "string") {
      about[key] = req.body[key];
    }
  });

  await about.save();
  return successResponse(res, { about });
});

const createTestimonial = asyncHandler(async (req, res) => {
  const { clientName, quote, role = "" } = req.body;

  if (!clientName || !quote) {
    res.status(400);
    throw new Error("Client name and quote are required");
  }

  const testimonial = await Testimonial.create({ clientName, quote, role });
  return successResponse(res, { testimonial }, 201);
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  ["clientName", "quote", "role"].forEach((key) => {
    if (typeof req.body[key] === "string") {
      testimonial[key] = req.body[key];
    }
  });

  if (typeof req.body.featured === "boolean") {
    testimonial.featured = req.body.featured;
  }

  await testimonial.save();
  return successResponse(res, { testimonial });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  await testimonial.deleteOne();
  return successResponse(res, { deleted: true });
});

const getDashboard = asyncHandler(async (_req, res) => {
  const [totalImages, totalCategories, slider] = await Promise.all([
    Image.countDocuments(),
    Category.countDocuments(),
    Slider.findOne()
  ]);

  return successResponse(res, {
    stats: {
      totalImages,
      totalCategories,
      sliderItems: slider?.items?.length || 0
    }
  });
});

module.exports = {
  getSiteContent,
  updateAbout,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getDashboard
};
