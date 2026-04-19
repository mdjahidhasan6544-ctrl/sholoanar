const express = require("express");

const {
  getImages,
  uploadImages,
  updateImage,
  deleteImage
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getImages);
router.post("/upload", protect, upload.array("images", 12), uploadImages);
router.put("/:id", protect, updateImage);
router.delete("/:id", protect, deleteImage);

module.exports = router;
