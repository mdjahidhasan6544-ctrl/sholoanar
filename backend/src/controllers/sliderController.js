const asyncHandler = require("express-async-handler");

const Slider = require("../models/Slider");
const { successResponse } = require("../utils/responses");

async function getOrCreateSlider() {
  let slider = await Slider.findOne().populate("items.image");

  if (!slider) {
    slider = await Slider.create({ items: [], autoplay: true });
    slider = await slider.populate("items.image");
  }

  return slider;
}

const getSlider = asyncHandler(async (_req, res) => {
  const slider = await getOrCreateSlider();
  return successResponse(res, { slider });
});

const updateSlider = asyncHandler(async (req, res) => {
  const { items = [], autoplay = true } = req.body;
  let slider = await Slider.findOne();

  if (!slider) {
    slider = new Slider();
  }

  slider.items = items;
  slider.autoplay = autoplay;
  await slider.save();
  await slider.populate("items.image");

  return successResponse(res, { slider });
});

module.exports = { getSlider, updateSlider };
