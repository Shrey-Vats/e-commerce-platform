import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import apiClient from "../api/apiClient";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/api/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Order Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline font-bold">
          Go Home
        </Link>
      </div>
    );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-16">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center border-t-8 border-green-500">
        <div className="bg-green-100 rounded-full p-6 mb-6 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 text-center">
          Order Placed!
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Thank you for your purchase. Your order{" "}
          <span className="font-bold text-indigo-700">#{order._id}</span> has
          been placed successfully.
        </p>
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">
            Order Summary
          </h2>
          <ul className="divide-y divide-gray-200 mb-2">
            {order.orderItems.map((item, idx) => (
              <li key={idx} className="py-2 flex justify-between items-center">
                <span className="text-gray-800">
                  {item.name} x {item.qty}
                </span>
                <span className="text-gray-700 font-bold">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-lg mb-1">
            <span>Shipping:</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg mb-1">
            <span>Tax:</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold mt-2">
            <span>Total:</span>
            <span className="text-indigo-700">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <Link
          to={`/order/${order._id}`}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-lg mb-3 text-center transition-all duration-200 shadow-md"
        >
          View Order Details
        </Link>
        <Link
          to="/"
          className="w-full bg-white border border-indigo-600 text-indigo-700 font-bold py-3 px-6 rounded-full text-lg text-center hover:bg-indigo-50 transition-all duration-200 shadow"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
