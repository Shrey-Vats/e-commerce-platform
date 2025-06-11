// frontend/src/components/Navbar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaUserCog, FaStore } from "react-icons/fa"; // Existing icons + NEW: FaStore icon
import { LuSun, LuMoon } from "react-icons/lu"; // Icons for theme toggle
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

const Navbar = () => {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth(); // Get userInfo and logout from your useAuth hook
  const { theme, toggleTheme } = useTheme(); // Get theme and toggleTheme from useTheme hook

  // Calculate total quantity of items in cart for display
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-indigo-700 dark:bg-gray-900 text-white py-4 shadow-lg transition-colors duration-300">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wider hover:text-indigo-200 dark:hover:text-gray-300 transition-colors"
        >
          MERN Shop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Admin Dashboard Link (Conditional) */}
          {userInfo && userInfo.isAdmin && (
            <Link
              to="/admin"
              className="flex items-center text-lg hover:text-indigo-200 dark:hover:text-gray-300 transition-colors"
            >
              <FaUserCog className="text-2xl mr-2" /> Admin
            </Link>
          )}

          {/* NEW: Seller Dashboard Link (Conditional - ADD THIS BLOCK) */}
          {userInfo && userInfo.isSeller && ( // Assuming isSeller will be a property on userInfo
            <Link
              to="/seller" 
              className="flex items-center text-lg hover:text-indigo-200 dark:hover:text-gray-300 transition-colors"
            >
              <FaStore className="text-2xl mr-2" /> Seller
            </Link>
          )}

          {/* Cart Link */}
          <Link
            to="/cart"
            className="flex items-center text-lg hover:text-indigo-200 dark:hover:text-gray-300 transition-colors relative"
          >
            <FaShoppingCart className="text-2xl mr-2" /> Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Profile / Sign In / Logout Link */}
          {userInfo ? (
            <>
              <Link
                to="/profile"
                className="flex items-center text-lg hover:text-indigo-200 dark:hover:text-gray-300 transition-colors"
              >
                <FaUser className="text-2xl mr-2" /> {userInfo.name}
              </Link>
              <button
                onClick={logout}
                className="text-lg hover:text-indigo-200 dark:hover:text-gray-300 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-lg hover:text-indigo-200 dark:hover:text-gray-300 transition-colors"
            >
              <FaUser className="text-2xl mr-2" /> Sign In
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-indigo-600 dark:bg-gray-700 text-white dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-gray-600 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <LuSun className="h-6 w-6" /> // Sun icon for light mode
            ) : (
              <LuMoon className="h-6 w-6" /> // Moon icon for dark mode
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;