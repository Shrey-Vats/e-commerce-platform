// frontend/src/pages/Cart.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItemQty } = useCart();
  const { userInfo } = useAuth();

  // The local state and useEffect for cartItems are now removed.
  // The cartItems are directly from the global context.

  // Use the context's functions for actions
  const updateCartQtyHandler = (item, qty) => {
    // Changed to take item object, as updateCartItemQty expects it
    updateCartItemQty(item, Number(qty));
  };

  const removeItemHandler = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(id);
    }
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=/checkout");
    }
  };

  // NEW: Calculate totals from localStorage, as CartContext now updates them there
  // This ensures consistency with the Navbar and potentially other components
  const itemsPrice = parseFloat(localStorage.getItem("itemsPrice") || 0);
  const shippingPrice = parseFloat(localStorage.getItem("shippingPrice") || 0);
  const taxPrice = parseFloat(localStorage.getItem("taxPrice") || 0);
  const totalPrice = parseFloat(localStorage.getItem("totalPrice") || 0);

  // You can still calculate totalItems locally if needed for display, based on cartItems from context
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 text-center">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <FaShoppingCart className="text-indigo-400 text-6xl mx-auto mb-4" />
          <p className="text-xl text-gray-700 mb-4">
            Your cart is currently empty.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
          >
            Start Shopping!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-xl p-6">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-6 last:border-b-0"
              >
                <div className="w-32 h-32 mr-6 mb-4 sm:mb-0 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md shadow-sm"
                  />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <Link
                    to={`/product/${item.product}`}
                    className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 block mb-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-indigo-700 text-2xl font-bold mb-3">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start">
                    <label
                      htmlFor={`qty-${item.product}`}
                      className="font-medium text-gray-700 mr-2"
                    >
                      Qty:
                    </label>
                    <select
                      id={`qty-${item.product}`}
                      className="border border-gray-300 rounded-md py-2 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={item.qty}
                      onChange={
                        (e) => updateCartQtyHandler(item, e.target.value) // Pass item object here
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-auto">
                  <button
                    onClick={() => removeItemHandler(item.product)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-xl h-fit">
            <h2 className="text-3xl font-bold mb-6 border-b-2 pb-4 text-gray-800">
              Order Summary
            </h2>
            {/* Displaying details from localStorage, managed by CartContext */}
            <div className="flex justify-between items-center text-lg mb-3">
              <span className="font-semibold text-gray-700">Items Price:</span>
              <span className="text-xl font-bold text-gray-900">
                ${itemsPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg mb-3">
              <span className="font-semibold text-gray-700">
                Shipping Price:
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${shippingPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg mb-3">
              <span className="font-semibold text-gray-700">Tax Price:</span>
              <span className="text-xl font-bold text-gray-900">
                ${taxPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold mb-8 pt-2 border-t border-gray-200">
              <span className="text-gray-800">Total:</span>
              <span className="text-indigo-700">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={checkoutHandler}
              className={`w-full py-4 px-6 rounded-full text-white font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105"
              }`}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
