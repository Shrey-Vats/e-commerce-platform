// backend/models/Banner.js
import mongoose from "mongoose"; // Use import

const bannerSchema = mongoose.Schema(
  {
    // Only imageUrl, isActive, order
    imageUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "#",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner; // Use export default
