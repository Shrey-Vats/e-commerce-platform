// backend/models/Banner.js
import mongoose from "mongoose"; // Use import

const bannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "#",
    },
    altText: {
      type: String,
      required: true,
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
