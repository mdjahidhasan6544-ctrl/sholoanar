const express = require("express");

const {
  getSiteContent,
  updateAbout,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getDashboard
} = require("../controllers/contentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSiteContent);
router.get("/dashboard", protect, getDashboard);
router.put("/about", protect, updateAbout);
router.post("/testimonials", protect, createTestimonial);
router.put("/testimonials/:id", protect, updateTestimonial);
router.delete("/testimonials/:id", protect, deleteTestimonial);

module.exports = router;
