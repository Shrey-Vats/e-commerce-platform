// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, userInfo, loading, error } = useAuth();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      toast.error(error || "Login failed. Please check your credentials.");
    }
  };

  return (
    // Added background gradient, full height, and centered flex
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] animate-fade-in-up">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
          Welcome Back
        </h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2" // Font-weight slightly bolder
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-300 transform focus:scale-[1.01]" // Stronger focus ring, subtle scale on focus
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-300 transform focus:scale-[1.01]"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:shadow-outline w-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" // Added gradient, stronger shadow, scale on hover
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader size={20} /> : "Sign In"}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center text-gray-700 text-lg">
          New Customer?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition-colors duration-200" // Stronger hover effect
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
