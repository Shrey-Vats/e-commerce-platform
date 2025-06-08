import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard"; // Will be created next
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products"); // Fetch products from your backend
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
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Latest Products
      </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
