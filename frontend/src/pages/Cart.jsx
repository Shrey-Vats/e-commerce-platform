import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa"; // You'll need to install react-icons

// For simplicity, we'll manage cart state locally here.
// In a real app, this would be a global state (Context API or Redux).
const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Placeholder for cart items

  useEffect(() => {
    // Simulate fetching cart items from localStorage or a context
    const storedCartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    setCartItems(storedCartItems);
  }, []);

  const updateCartQtyHandler = (id, qty) => {
    const updatedItems = cartItems.map((item) =>
      item.product === id ? { ...item, qty: Number(qty) } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    toast.success("Cart updated!");
  };

  const removeFromCartHandler = (id) => {
    const updatedItems = cartItems.filter((item) => item.product !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    toast.info("Item removed from cart!");
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/checkout"); // Redirect to login if not authenticated, then checkout
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Go shopping!
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center border-b border-gray-200 py-4"
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
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-700">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <select
                    className="border rounded p-2 mr-4"
                    value={item.qty}
                    onChange={(e) =>
                      updateCartQtyHandler(item.product, e.target.value)
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCartHandler(item.product)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Order Summary
            </h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Items:</span>
              <span>({totalItems})</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
            <button
              onClick={checkoutHandler}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-300 ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
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
