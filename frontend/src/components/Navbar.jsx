import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa"; // Import icons

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsDropdownOpen(false); // Close dropdown on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide text-indigo-300 hover:text-indigo-200 transition-colors duration-200"
        >
          MERNShop
        </Link>

        {/* Search Bar (Desktop) - You can integrate actual search logic here */}
        <div className="hidden md:flex items-center bg-gray-700 rounded-full px-4 py-2 w-1/3 max-w-lg">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none flex-grow text-white placeholder-gray-400"
          />
          <FaSearch className="ml-2 text-gray-400" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/cart"
            className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <FaShoppingCart className="w-5 h-5 mr-2" />
            Cart
          </Link>

          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
              >
                <FaUser className="w-5 h-5 mr-2" />
                {userInfo.name}
              </button>
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-down origin-top-right">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  {userInfo.isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="block px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200 border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaUser className="w-5 h-5 mr-2" />
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 pb-4 animate-fade-in-down">
          <div className="container mx-auto px-4 py-2">
            {/* Mobile Search Bar */}
            <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none flex-grow text-white placeholder-gray-400"
              />
              <FaSearch className="ml-2 text-gray-400" />
            </div>

            <Link
              to="/cart"
              className="block px-4 py-3 text-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
              onClick={toggleMobileMenu}
            >
              <FaShoppingCart className="w-5 h-5 mr-3" />
              Cart
            </Link>
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  <FaUser className="w-5 h-5 mr-3" />
                  {userInfo.name} (Profile)
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                    onClick={toggleMobileMenu}
                  >
                    <FaBars className="w-5 h-5 mr-3" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left px-4 py-3 text-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-3 text-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                onClick={toggleMobileMenu}
              >
                <FaUser className="w-5 h-5 mr-3" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
