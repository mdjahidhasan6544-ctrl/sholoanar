const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    photographerName: {
      type: String,
      default: "Sholoana Studio"
    },
    tagline: {
      type: String,
      default: "Cinematic photography with intimacy, texture, and quiet drama."
    },
    bio: {
      type: String,
      default: ""
    },
    vision: {
      type: String,
      default: ""
    },
    dmNote: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    contactEmail: {
      type: String,
      default: ""
    },
    tiktokUrl: {
      type: String,
      default: ""
    },
    facebookUrl: {
      type: String,
      default: ""
    },
    instagramUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
