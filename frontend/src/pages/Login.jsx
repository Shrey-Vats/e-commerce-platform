import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import { toast } from "react-toastify"; // Ensure toast is imported for messages

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
      // Error is already handled by useAuth and toast will show it,
      // but you can add more specific client-side validation here if needed.
      toast.error(error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Welcome Back
        </h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full text-lg shadow-md hover:shadow-lg transition-all duration-300"
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
            className="text-indigo-600 hover:underline font-semibold"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
