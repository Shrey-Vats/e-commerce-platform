// This file can contain various helper functions used across the frontend.

// Example: Function to format prices
export const formatPrice = (price) => {
  if (typeof price !== "number") return "N/A";
  return `$${price.toFixed(2)}`;
};

// Example: Function to validate email format
export const isValidEmail = (email) => {
  // Simple regex for email validation
  return /\S+@\S+\.\S+/.test(email);
};

// You can add more helper functions as your application grows,
// e.g., calculate tax, handle date formatting, etc.
