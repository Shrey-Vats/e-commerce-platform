import React from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  return (
    <div className="py-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Checkout</h1>
      <p className="text-lg text-gray-700 mb-6">
        This is the checkout page. Here you would implement shipping details,
        payment, etc.
      </p>
      <div className="space-x-4">
        <Link
          to="/cart"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Back to Cart
        </Link>
        <button
          onClick={() => alert("Proceeding to payment! (Placeholder)")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
