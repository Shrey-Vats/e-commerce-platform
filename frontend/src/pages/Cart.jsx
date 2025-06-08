// frontend/src/pages/Cart.jsx

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import Message from "../components/Message";
import { useCart } from "../context/CartContext"; // <<< ADD THIS LINE: Import useCart hook
import { toast } from "react-toastify"; // Import toast for messages

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItemQty } = useCart(); // <<< ADD THIS LINE: Get cart functions

  // Calculate totals from localStorage, as CartContext updates them there
  const itemsPrice = parseFloat(localStorage.getItem("itemsPrice") || 0);
  const shippingPrice = parseFloat(localStorage.getItem("shippingPrice") || 0);
  const taxPrice = parseFloat(localStorage.getItem("taxPrice") || 0);
  const totalPrice = parseFloat(localStorage.getItem("totalPrice") || 0);

  const checkoutHandler = () => {
    navigate("/login?redirect=/checkout"); // Redirect to checkout after login
  };

  const removeItemHandler = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(id);
    }
  };

  const updateQtyHandler = (product, qty) => {
    updateCartItemQty(product, Number(qty));
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        <FaShoppingCart className="inline-block mr-3 text-indigo-600" />{" "}
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <Message type="info">
          Your cart is empty.{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Go back to shop
          </Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Column */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="w-24 h-24 mr-4 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <Link
                    to={`/product/${item.product}`}
                    className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-lg my-1">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">Qty:</span>
                    <select
                      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={item.qty}
                      onChange={(e) => updateQtyHandler(item, e.target.value)}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeItemHandler(item.product)}
                      className="ml-4 p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 ml-auto">
                  ${(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-xl h-fit">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-lg text-gray-700">
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-semibold">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold">
                  ${shippingPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-semibold">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-xl pt-4 border-t mt-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={checkoutHandler}
              className={`w-full mt-8 py-3 text-xl font-bold rounded-lg transition-colors duration-300 shadow-md
                ${
                  cartItems.length === 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              disabled={cartItems.length === 0}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
