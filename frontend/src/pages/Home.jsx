import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// Banner carousel dependencies
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Banner state
  const [banners, setBanners] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/products");
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
        toast.error("Failed to load products.");
      }
    };
    const fetchBanners = async () => {
      try {
        const { data } = await apiClient.get("/api/banners");
        setBanners(data);
      } catch (err) {
        // Fail silently for banners
      }
    };
    fetchProducts();
    fetchBanners();
  }, []);

  // Banner carousel controls
  const nextBanner = () =>
    setBannerIdx((prev) => (banners.length ? (prev + 1) % banners.length : 0));
  const prevBanner = () =>
    setBannerIdx((prev) =>
      banners.length ? (prev - 1 + banners.length) % banners.length : 0
    );

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Banner Carousel Section */}
      {banners.length > 0 && (
        <section className="relative w-full mb-12">
          <div className="w-full relative">
            {banners.length > 1 && (
              <button
                onClick={prevBanner}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-indigo-700 rounded-full p-1 shadow-lg z-10"
                aria-label="Previous Banner"
              >
                <FaChevronLeft size={32} />
              </button>
            )}
            <img
              src={banners[bannerIdx].imageUrl}
              alt="Banner"
              className="w-full h-[180px] sm:h-[260px] md:h-[340px] lg:h-[420px] xl:h-[500px] object-cover object-center rounded-none shadow-2xl border-0"
              style={{ maxHeight: "500px", minHeight: "180px" }}
            />
            {banners.length > 1 && (
              <button
                onClick={nextBanner}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-indigo-700 rounded-full p-2 shadow-lg z-10"
                aria-label="Next Banner"
              >
                <FaChevronRight size={32} />
              </button>
            )}
            {/* Banner indicators */}
            {banners.length > 1 && (
              <div className="flex justify-center gap-2 absolute bottom-4 left-0 right-0 z-10">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBannerIdx(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      idx === bannerIdx
                        ? "bg-indigo-500 scale-125"
                        : "bg-white/60"
                    }`}
                    aria-label={`Go to banner ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      <div className="container mx-auto px-2 py-8">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Latest Arrivals
        </h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
