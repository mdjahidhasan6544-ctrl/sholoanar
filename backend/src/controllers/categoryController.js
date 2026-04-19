const asyncHandler = require("express-async-handler");

const Category = require("../models/Category");
const { successResponse } = require("../utils/responses");
const slugify = require("../utils/slugify");

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  return successResponse(res, { categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, coverImage = "", description = "", order = 0 } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.create({
    name,
    slug: slugify(name),
    coverImage,
    description,
    order
  });

  return successResponse(res, { category }, 201);
});

module.exports = { getCategories, createCategory };
