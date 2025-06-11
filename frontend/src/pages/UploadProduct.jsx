// frontend/src/pages/UploadProduct.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader"; // Assuming you have a Loader component

const UploadProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); // For file objects
  const [video, setVideo] = useState(null); // For file object
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const categories = [
    "Electronics",
    "Fashion",
    "Home Goods",
    "Books",
    "Sports",
  ]; // Example categories

  const handleImageChange = (e) => {
    setImages([...e.target.files].slice(0, 5)); // Limit to 5 images
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]); // Only one video
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In Phase 3 (Enhance Product Upload), you'll add actual file upload logic here
      // For now, simulate success:
      console.log("Product Data:", {
        title,
        description,
        price,
        quantity,
        category,
        images: images.map((img) => img.name),
        video: video?.name,
      });
      toast.success("Product uploaded successfully! (Simulated)");
      navigate("/seller/dashboard"); // Redirect after simulated upload
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        theme === "dark"
          ? "bg-bg-default text-text-default"
          : "bg-bg-default text-text-default"
      } transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-2xl p-8 rounded-lg shadow-lg bg-bg-card transition-colors duration-300`}
      >
        <h1
          className={`text-3xl font-bold mb-6 text-center text-text-heading transition-colors duration-300`}
        >
          Upload New Product
        </h1>

        {loading && <Loader />}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Product Title
            </label>
            <input
              type="text"
              id="title"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="5"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium mb-2 text-text-default"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium mb-2 text-text-default"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Category
            </label>
            <select
              id="category"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload (for future use - no actual upload logic here yet) */}
          <div className="mb-4">
            <label
              htmlFor="images"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Product Images (up to 5)
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <p className="mt-2 text-sm text-text-secondary">
                Selected: {images.map((img) => img.name).join(", ")}
              </p>
            )}
          </div>

          {/* Video Upload (for future use - no actual upload logic here yet) */}
          <div className="mb-6">
            <label
              htmlFor="video"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Product Video (optional)
            </label>
            <input
              type="file"
              id="video"
              accept="video/*"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              onChange={handleVideoChange}
            />
            {video && (
              <p className="mt-2 text-sm text-text-secondary">
                Selected: {video.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-main hover:bg-primary-hover ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
