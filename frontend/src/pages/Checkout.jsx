import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // Get prices from localStorage (CartContext keeps them updated)
  const itemsPrice = parseFloat(localStorage.getItem("itemsPrice") || 0);
  const shippingPrice = parseFloat(localStorage.getItem("shippingPrice") || 0);
  const taxPrice = parseFloat(localStorage.getItem("taxPrice") || 0);
  const totalPrice = parseFloat(localStorage.getItem("totalPrice") || 0);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(0);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    label: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressError, setAddressError] = useState(null);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await apiClient.get("/api/users/addresses");
        setAddresses(data.addresses || []);
        setDefaultAddress(data.defaultAddress || 0);
        if (data.addresses && data.addresses.length > 0) {
          setSelectedAddressIdx(data.defaultAddress || 0);
          setShippingAddress(data.addresses[data.defaultAddress || 0]);
        } else {
          setShowAddressForm(true);
        }
      } catch (err) {
        // If error, fallback to address form
        setShowAddressForm(true);
      }
    };
    fetchAddresses();
  }, []);

  // Handle address select
  const handleSelectAddress = (e) => {
    const idx = Number(e.target.value);
    setSelectedAddressIdx(idx);
    setShippingAddress(addresses[idx]);
    setShowAddressForm(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Add new address to profile
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError(null);
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setAddressError("Please fill in all address fields.");
      return;
    }
    try {
      await apiClient.post("/api/users/addresses", shippingAddress);
      const { data } = await apiClient.get("/api/users/addresses");
      setAddresses(data.addresses || []);
      setDefaultAddress(data.defaultAddress || 0);
      setSelectedAddressIdx(data.addresses.length - 1);
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err.response?.data?.message || err.message);
    }
  };

  // Place order handler
  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setError(null);
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError("Please fill in all shipping fields.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      // Prepare order items to match backend's expected structure
      const orderItems = cartItems.map((item) => ({
        product: item.product || item._id, // Use item.product if it exists, otherwise use item._id
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
      }));
      const { data } = await apiClient.post("/api/orders", {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Stepper state: 0 = Address, 1 = Payment, 2 = Review
  const [step, setStep] = useState(0);
  const steps = ["Address", "Payment", "Review & Place Order"];
  const Stepper = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg border-2 transition-all duration-200
              ${
                step === idx
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                  : step > idx
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-400 border-gray-300"
              }
            `}
          >
            {step > idx ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              idx + 1
            )}
          </div>
          <span
            className={`ml-3 mr-6 text-base font-semibold ${
              step === idx ? "text-indigo-700" : "text-gray-500"
            }`}
          >
            {label}
          </span>
          {idx < steps.length - 1 && (
            <div className="w-8 h-1 bg-gray-300 rounded" />
          )}
        </div>
      ))}
    </div>
  );

  // Stepper navigation logic
  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Step content rendering
  const renderStepContent = () => {
    if (step === 0) {
      return (
        <>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              1
            </span>
            Shipping Address
          </h2>
          {addresses.length > 0 && !showAddressForm && (
            <>
              <label className="block mb-2 font-medium">Select Address</label>
              <select
                className="border rounded px-4 py-3 text-lg mb-4"
                value={selectedAddressIdx}
                onChange={handleSelectAddress}
              >
                {addresses.map((addr, idx) => (
                  <option key={idx} value={idx}>
                    {addr.label ? `${addr.label}: ` : ""}
                    {addr.address}, {addr.city}, {addr.postalCode},{" "}
                    {addr.country}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-indigo-600 hover:underline mb-4"
                onClick={() => {
                  setShowAddressForm(true);
                  setShippingAddress({
                    address: "",
                    city: "",
                    postalCode: "",
                    country: "",
                    label: "",
                  });
                }}
              >
                + Add New Address
              </button>
            </>
          )}
          {(showAddressForm || addresses.length === 0) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="label"
                  placeholder="Label (e.g. Home, Work)"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.label || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  required
                />
              </div>
              {addressError && (
                <Message variant="danger">{addressError}</Message>
              )}
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full text-lg mt-2 transition-all duration-200 shadow-md"
                onClick={handleAddAddress}
              >
                Save Address
              </button>
              {addresses.length > 0 && (
                <button
                  type="button"
                  className="ml-4 text-gray-600 hover:text-gray-900 underline"
                  onClick={() => {
                    setShowAddressForm(false);
                    setShippingAddress(
                      addresses[selectedAddressIdx] || addresses[0]
                    );
                  }}
                >
                  Cancel
                </button>
              )}
            </>
          )}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-full text-lg transition-all duration-200 shadow-md"
              onClick={nextStep}
              disabled={addresses.length === 0 && !shippingAddress.address}
            >
              Next: Payment
            </button>
          </div>
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              2
            </span>
            Payment Method
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("PayPal")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "PayPal"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <img
                src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                alt="PayPal"
                className="h-6 w-6 mr-2"
              />{" "}
              PayPal
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Credit Card")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "Credit Card"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="mr-2">💳</span> Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("UPI")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "UPI"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="mr-2">🏦</span> UPI
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash on Delivery")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "Cash on Delivery"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="mr-2">💵</span> Cash on Delivery
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            Selected:{" "}
            <span className="font-bold text-indigo-700">{paymentMethod}</span>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-8 rounded-full text-lg transition-all duration-200 shadow-md"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-full text-lg transition-all duration-200 shadow-md"
              onClick={nextStep}
            >
              Next: Review
            </button>
          </div>
        </>
      );
    }
    // Review & Place Order
    return (
      <>
        <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            3
          </span>
          Review & Place Order
        </h2>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">
            Shipping Address:
          </h3>
          <div className="text-gray-800">
            {shippingAddress.label && (
              <span className="font-bold mr-2">{shippingAddress.label}:</span>
            )}
            {shippingAddress.address}, {shippingAddress.city},{" "}
            {shippingAddress.postalCode}, {shippingAddress.country}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">Payment Method:</h3>
          <div className="text-gray-800">{paymentMethod}</div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">Order Items:</h3>
          <ul className="divide-y divide-gray-200 mb-2">
            {cartItems.map((item) => (
              <li
                key={item.product}
                className="py-2 flex justify-between items-center"
              >
                <span className="text-gray-800">
                  {item.name} x {item.qty}
                </span>
                <span className="text-gray-700 font-bold">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {error && <Message variant="danger">{error}</Message>}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-8 rounded-full text-lg transition-all duration-200 shadow-md"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full text-lg transition-all duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? <Loader size={24} /> : "Place Order"}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 md:px-4">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-800 text-center tracking-tight">
        Checkout
      </h1>
      <Stepper />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Shipping & Payment Form */}
        <form
          onSubmit={placeOrderHandler}
          className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 md:col-span-2"
        >
          {/* Step 1: Address */}
          <h2 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              1
            </span>
            Shipping Address
          </h2>
          {addresses.length > 0 && !showAddressForm && (
            <>
              <label className="block mb-2 font-medium">Select Address</label>
              <select
                className="border rounded px-4 py-3 text-lg mb-4"
                value={selectedAddressIdx}
                onChange={handleSelectAddress}
              >
                {addresses.map((addr, idx) => (
                  <option key={idx} value={idx}>
                    {addr.label ? `${addr.label}: ` : ""}
                    {addr.address}, {addr.city}, {addr.postalCode},{" "}
                    {addr.country}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-indigo-600 hover:underline mb-4"
                onClick={() => {
                  setShowAddressForm(true);
                  setShippingAddress({
                    address: "",
                    city: "",
                    postalCode: "",
                    country: "",
                    label: "",
                  });
                }}
              >
                + Add New Address
              </button>
            </>
          )}
          {(showAddressForm || addresses.length === 0) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="label"
                  placeholder="Label (e.g. Home, Work)"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.label || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="border rounded px-4 py-3 text-lg"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  required
                />
              </div>
              {addressError && (
                <Message variant="danger">{addressError}</Message>
              )}
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full text-lg mt-2 transition-all duration-200 shadow-md"
                onClick={handleAddAddress}
              >
                Save Address
              </button>
              {addresses.length > 0 && (
                <button
                  type="button"
                  className="ml-4 text-gray-600 hover:text-gray-900 underline"
                  onClick={() => {
                    setShowAddressForm(false);
                    setShippingAddress(
                      addresses[selectedAddressIdx] || addresses[0]
                    );
                  }}
                >
                  Cancel
                </button>
              )}
            </>
          )}

          {/* Step 2: Payment */}
          <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              2
            </span>
            Payment Method
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("PayPal")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "PayPal"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <img
                src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                alt="PayPal"
                className="h-6 w-6 mr-2"
              />{" "}
              PayPal
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Credit Card")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "Credit Card"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="mr-2">💳</span> Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("UPI")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "UPI"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="mr-2">🏦</span> UPI
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash on Delivery")}
              className={`flex items-center justify-center border rounded-lg py-3 px-4 text-lg font-semibold transition-all duration-200 shadow-sm ${
                paymentMethod === "Cash on Delivery"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="mr-2">💵</span> Cash on Delivery
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            Selected:{" "}
            <span className="font-bold text-indigo-700">{paymentMethod}</span>
          </div>
          {error && <Message variant="danger">{error}</Message>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg mt-4 transition-all duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? <Loader size={24} /> : "Place Order"}
          </button>
          <Link
            to="/cart"
            className="text-indigo-600 hover:underline text-center mt-2"
          >
            &larr; Back to Cart
          </Link>
        </form>

        {/* Order Summary - sticky on desktop */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:sticky md:top-24 md:col-span-1 border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              3
            </span>
            Order Summary
          </h2>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.product}
                className="py-3 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">
                  {item.name} x {item.qty}
                </span>
                <span className="text-gray-700 font-bold">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-lg mb-2">
            <span>Items:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg mb-2">
            <span>Shipping:</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg mb-2">
            <span>Tax:</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold mt-6 pt-4 border-t">
            <span>Total:</span>
            <span className="text-indigo-700">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
