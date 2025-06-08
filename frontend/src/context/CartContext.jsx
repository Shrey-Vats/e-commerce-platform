// frontend/src/context/CartContext.jsx

import React, { createContext, useReducer, useContext, useEffect } from "react";
import { toast } from "react-toastify";

// 1. Create the Cart Context
export const CartContext = createContext();

// 2. Define the Reducer Function
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item.product === newItem.product
      );

      if (existItem) {
        // If item exists, update its quantity
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.product === existItem.product ? newItem : item
          ),
        };
      } else {
        // If new item, add to cart
        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
        };
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product !== action.payload
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

// 3. Create the Cart Provider Component
export const CartProvider = ({ children }) => {
  // Initialize state from localStorage or empty array
  const initialState = {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Effect to update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    // Calculate totals whenever cart items change
    updateCartTotals(state.cartItems);
  }, [state.cartItems]);

  // Helper to update totals in localStorage (for use in Navbar/Cart Page)
  const updateCartTotals = (items) => {
    const itemsPrice = items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: Free shipping over $100
    const taxPrice = 0.15 * itemsPrice; // Example: 15% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    localStorage.setItem("itemsPrice", itemsPrice.toFixed(2));
    localStorage.setItem("shippingPrice", shippingPrice.toFixed(2));
    localStorage.setItem("taxPrice", taxPrice.toFixed(2));
    localStorage.setItem("totalPrice", totalPrice.toFixed(2));
  };

  // Action: Add Item to Cart
  const addToCart = (product, qty) => {
    // Note: In a real app, you might fetch product details here if not fully available
    // For now, we assume product object passed contains necessary info (id, name, image, price, countInStock)
    const item = {
      product: product._id, // Renamed from 'id' to 'product' to match backend conventions
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    };
    dispatch({ type: "ADD_ITEM", payload: item });
    toast.success(`${qty} of ${product.name} added to cart!`);
  };

  // Action: Remove Item from Cart
  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast.info("Item removed from cart.");
  };

  // Action: Update Item Quantity (re-uses ADD_ITEM logic, as it updates if exists)
  const updateCartItemQty = (product, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    };
    dispatch({ type: "ADD_ITEM", payload: item }); // Re-use ADD_ITEM, it updates if item exists
    toast.success("Cart quantity updated.");
  };

  // Action: Clear Cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Cart cleared.");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        clearCart,
        // You can also pass totals from state if you calculate them in reducer
        // For simplicity now, we fetch from localStorage directly in components for totals
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom Hook to use Cart Context
export const useCart = () => {
  return useContext(CartContext);
};
