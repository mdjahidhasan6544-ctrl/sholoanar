const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    items: [
      {
        image: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Image"
        },
        heading: {
          type: String,
          default: ""
        },
        subheading: {
          type: String,
          default: ""
        },
        order: {
          type: Number,
          default: 0
        }
      }
    ],
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);
