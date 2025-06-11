import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
// If ?seller=me is passed, only return products for the logged-in seller
const getProducts = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.query.seller === "me" && req.user && req.user.isSeller) {
    filter.seller = req.user._id;
  }
  const products = await Product.find(filter);
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404); // Not Found
    throw new Error("Product not found");
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Seller (or Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Only allow if admin or seller owns the product
  if (
    req.user.isAdmin ||
    (req.user.isSeller && product.seller.toString() === req.user._id.toString())
  ) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    seller: req.user._id, // Seller who created the product (from auth middleware)
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    images: [],
    videos: [],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Seller (or Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    images,
    videos,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Only allow if admin or seller owns the product
  if (
    req.user.isAdmin ||
    (req.user.isSeller && product.seller.toString() === req.user._id.toString())
  ) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock =
      countInStock !== undefined ? countInStock : product.countInStock;
    if (images) product.images = images;
    if (videos) product.videos = videos;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
