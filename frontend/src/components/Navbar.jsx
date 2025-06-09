// frontend/src/components/Navbar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaUserCog } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { cartItems } = useCart();
  const { userInfo } = useAuth(); // Get userInfo from your useAuth hook

  // Calculate total quantity of items in cart for display
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-indigo-700 text-white py-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wider hover:text-indigo-200 transition-colors"
        >
          MERN Shop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Admin Dashboard Link (Conditional) */}
          {userInfo && userInfo.isAdmin && (
            <Link
              to="/admin" // <<< CHANGED: Point to /admin instead of /admin/dashboard
              className="flex items-center text-lg hover:text-indigo-200 transition-colors"
            >
              <FaUserCog className="text-2xl mr-2" /> Admin
            </Link>
          )}

          {/* Cart Link */}
          <Link
            to="/cart"
            className="flex items-center text-lg hover:text-indigo-200 transition-colors relative"
          >
            <FaShoppingCart className="text-2xl mr-2" /> Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Profile / Sign In Link */}
          {userInfo ? (
            <Link
              to="/profile"
              className="flex items-center text-lg hover:text-indigo-200 transition-colors"
            >
              <FaUser className="text-2xl mr-2" /> {userInfo.name}
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-lg hover:text-indigo-200 transition-colors"
            >
              <FaUser className="text-2xl mr-2" /> Sign In
            </Link>
          )}
          {/* Add more links as needed */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
