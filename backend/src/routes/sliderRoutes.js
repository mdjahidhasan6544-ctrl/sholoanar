const express = require("express");

const { getSlider, updateSlider } = require("../controllers/sliderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSlider);
router.put("/", protect, updateSlider);

module.exports = router;
