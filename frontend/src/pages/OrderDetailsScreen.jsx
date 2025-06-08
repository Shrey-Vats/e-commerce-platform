import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient"; // Import apiClient
import { useAuth } from "../hooks/useAuth"; // To check for admin status for 'mark as delivered'

const OrderDetailsScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useAuth(); // Get user info to check for admin

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/api/orders/${orderId}`); // Use apiClient
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
      toast.error("Failed to load order details.");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const deliverOrderHandler = async () => {
    try {
      setLoadingDeliver(true);
      await apiClient.put(`/api/orders/${orderId}/deliver`); // Use apiClient
      toast.success("Order marked as delivered!");
      setLoadingDeliver(false);
      fetchOrder(); // Refetch order to update status
    } catch (err) {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      toast.error(message);
      setLoadingDeliver(false);
    }
  };

  return (
    <div className="py-8">
      <Link
        to="/admin/orders"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to Orders
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Order {orderId}
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Shipping
              </h2>
              <p className="mb-2">
                <strong>Name:</strong> {order.user.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${order.user.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {order.user.email}
                </a>
              </p>
              <p className="mb-2">
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <p className="text-green-600 font-bold">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </p>
              ) : (
                <p className="text-red-600 font-bold">Not Delivered</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Payment Method
              </h2>
              <p className="mb-2">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <p className="text-green-600 font-bold">
                  Paid on {order.paidAt.substring(0, 10)}
                </p>
              ) : (
                <p className="text-red-600 font-bold">Not Paid</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Order Items
              </h2>
              {order.orderItems.length === 0 ? (
                <p>Order is empty</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <li key={index} className="py-4 flex items-center">
                      <div className="w-16 h-16 mr-4 flex-shrink-0">
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
                        <p className="text-gray-700">
                          {item.qty} x ${item.price.toFixed(2)} = $
                          {item.qty * item.price.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Order Summary
            </h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Items:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  onClick={deliverOrderHandler}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  disabled={loadingDeliver}
                >
                  {loadingDeliver ? <Loader size={20} /> : "Mark As Delivered"}
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsScreen;
