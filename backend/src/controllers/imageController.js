const asyncHandler = require("express-async-handler");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { Readable } = require("stream");

const Category = require("../models/Category");
const Image = require("../models/Image");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const { successResponse } = require("../utils/responses");

const uploadsDirectory = path.resolve(__dirname, "../../uploads");

async function saveLocally(buffer, fileName) {
  await fs.mkdir(uploadsDirectory, { recursive: true });
  const filePath = path.join(uploadsDirectory, `${fileName}.jpg`);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

async function uploadToCloudinary(buffer, fileName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "sholoana",
        public_id: fileName,
        resource_type: "image",
        format: "jpg"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

function isServerlessRuntime() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

const getImages = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  const images = await Image.find(query)
    .populate("category", "name slug")
    .sort({ sortOrder: 1, createdAt: -1 });

  return successResponse(res, { images });
});

const uploadImages = asyncHandler(async (req, res) => {
  const { category, title = "", tags = "" } = req.body;

  if (!category) {
    res.status(400);
    throw new Error("Category is required");
  }

  const categoryDoc = await Category.findById(category);

  if (!categoryDoc) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (!req.files?.length) {
    res.status(400);
    throw new Error("At least one image is required");
  }

  if (isServerlessRuntime() && !isCloudinaryConfigured()) {
    res.status(500);
    throw new Error("Cloudinary is required for image uploads in the deployed environment");
  }

  const uploaded = [];

  for (const [index, file] of req.files.entries()) {
    const baseName = file.originalname.replace(/\.[^.]+$/, "");
    const localId = `${Date.now()}-${index}-${baseName}`.replace(/[^a-zA-Z0-9-_]/g, "-");
    const optimized = await sharp(file.buffer)
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    let imageUrl;
    let publicId;
    let width = optimized.info.width;
    let height = optimized.info.height;

    if (isCloudinaryConfigured()) {
      const uploadedAsset = await uploadToCloudinary(optimized.data, localId);
      imageUrl = uploadedAsset.secure_url;
      publicId = uploadedAsset.public_id;
      width = uploadedAsset.width || width;
      height = uploadedAsset.height || height;
    } else {
      await saveLocally(optimized.data, localId);
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${localId}.jpg`;
      publicId = `local:${localId}.jpg`;
    }

    const image = await Image.create({
      title: title || baseName,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      imageUrl,
      publicId,
      width,
      height
    });

    uploaded.push(image);
  }

  const images = await Image.find({
    _id: { $in: uploaded.map((item) => item._id) }
  }).populate("category", "name slug");

  return successResponse(res, { images }, 201);
});

const updateImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  const { title, tags, category, featured, sortOrder } = req.body;

  if (category) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      res.status(404);
      throw new Error("Category not found");
    }
    image.category = category;
  }

  if (typeof title === "string") {
    image.title = title;
  }

  if (Array.isArray(tags)) {
    image.tags = tags;
  } else if (typeof tags === "string") {
    image.tags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof featured === "boolean") {
    image.featured = featured;
  }

  if (typeof sortOrder === "number") {
    image.sortOrder = sortOrder;
  }

  await image.save();
  const populated = await image.populate("category", "name slug");

  return successResponse(res, { image: populated });
});

const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  if (image.publicId?.startsWith("local:")) {
    const fileName = image.publicId.slice("local:".length);
    const filePath = path.join(uploadsDirectory, path.basename(fileName));
    await fs.rm(filePath, { force: true });
  } else if (isCloudinaryConfigured() && image.publicId) {
    await cloudinary.uploader.destroy(image.publicId, { resource_type: "image" });
  }

  await image.deleteOne();

  return successResponse(res, { deleted: true });
});

module.exports = { getImages, uploadImages, updateImage, deleteImage };
