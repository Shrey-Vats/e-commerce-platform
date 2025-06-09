import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchProducts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {" "}
      {/* Adjust height for content below navbar/footer */}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4 mb-12 shadow-inner">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
            Discover Your Next Obsession
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 animate-fade-in-up delay-100">
            Premium products, unbeatable prices.
          </p>
          <Link
            to="/products" // You might want a dedicated products page later
            className="inline-block bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 transform animate-fade-in-up delay-200"
          >
            Shop Now
          </Link>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Latest Arrivals
        </h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {" "}
            {/* Changed lg:grid-cols-4 to lg:grid-cols-3 and added xl:grid-cols-4, also gap-8 to gap-10 */}
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
