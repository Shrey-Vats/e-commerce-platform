import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Layouts
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";

// Public Pages (initial placeholders)
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Protected Pages (initial placeholders)
import Checkout from "../pages/Checkout";

// Admin Pages (initial placeholders)
import AdminDashboard from "../pages/AdminDashboard";

// Placeholder for protected routes (will use a custom component later)
import PrivateRoute from "./PrivateRoute"; // We'll create this soon
import AdminRoute from "./AdminRoute"; // We'll create this soon

const router = createBrowserRouter(
  createRoutesFromElements(
    // Main Layout Route (public and protected routes)
    <Route path="/" element={<MainLayout />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (requires user login) */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        {/* Add more protected routes here */}
      </Route>
    </Route>,

    // Admin Layout Route (admin-specific routes)
    <Route path="/admin" element={<AdminLayout />}>
      {/* Admin Protected Routes (requires admin login) */}
      <Route path="" element={<AdminRoute />}>
        <Route index={true} element={<AdminDashboard />} />{" "}
        {/* Admin Dashboard home */}
        {/* Add more admin routes here (e.g., /admin/products, /admin/orders) */}
      </Route>
    </Route>
  )
);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
