// backend/controllers/bannerController.js
import asyncHandler from "express-async-handler"; // Use import
import Banner from "../models/Banner.js"; // Use import and .js extension

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
  res.json(banners);
});

// @desc    Get all banners (for admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ order: 1 });
  res.json(banners);
});

// @desc    Get banner by ID (for admin)
// @route   GET /api/banners/:id
// @access  Private/Admin
const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    res.json(banner);
  } else {
    res.status(404);
    throw new Error("Banner not found");
  }
});

// @desc    Create a new banner (for admin)
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, link, altText, isActive, order } =
    req.body;

  const banner = new Banner({
    title,
    subtitle,
    imageUrl,
    link,
    altText,
    isActive: isActive !== undefined ? isActive : true,
    order: order !== undefined ? order : 0,
  });

  const createdBanner = await banner.save();
  res.status(201).json(createdBanner);
});

// @desc    Update a banner (for admin)
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, link, altText, isActive, order } =
    req.body;

  const banner = await Banner.findById(req.params.id);

  if (banner) {
    banner.title = title || banner.title;
    banner.subtitle = subtitle || banner.subtitle;
    banner.imageUrl = imageUrl || banner.imageUrl;
    banner.link = link !== undefined ? link : banner.link;
    banner.altText = altText || banner.altText;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    banner.order = order !== undefined ? order : banner.order;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error("Banner not found");
  }
});

// @desc    Delete a banner (for admin)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    await Banner.deleteOne({ _id: banner._id });
    res.json({ message: "Banner removed" });
  } else {
    res.status(404);
    throw new Error("Banner not found");
  }
});

export {
  // Use export for multiple named exports
  getActiveBanners,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
