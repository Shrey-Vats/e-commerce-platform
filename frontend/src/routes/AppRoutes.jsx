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

// Public Pages
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Protected Pages
import Checkout from "../pages/Checkout";
import UserProfileScreen from "../pages/UserProfileScreen"; // <<< ADD THIS LINE: Import UserProfileScreen

// Admin Pages
import AdminDashboard from "../pages/AdminDashboard";
import ProductListScreen from "../pages/ProductListScreen";
import ProductEditScreen from "../pages/ProductEditScreen";
import OrderListScreen from "../pages/OrderListScreen";
import OrderDetailsScreen from "../pages/OrderDetailsScreen";

// Route Protectors
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    // *** SOLUTION: Wrap all top-level Route components in a React Fragment ***
    <>
      {/* Main Layout Route (public and protected user routes) */}
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index={true} element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (requires user login) */}
        <Route path="" element={<PrivateRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<UserProfileScreen />} />{" "}
          {/* <<< ADD THIS LINE: Profile Route */}
        </Route>
      </Route>

      {/* Admin Layout Route (admin-specific routes) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Admin Protected Routes (requires admin login) */}
        <Route path="" element={<AdminRoute />}>
          <Route index={true} element={<AdminDashboard />} />
          <Route path="products" element={<ProductListScreen />} />
          <Route path="product/:id/edit" element={<ProductEditScreen />} />
          <Route path="orders" element={<OrderListScreen />} />
          <Route path="order/:id" element={<OrderDetailsScreen />} />
          {/* Example: Add an admin user list route here */}
          {/* <Route path="users" element={<UserListScreen />} /> */}
        </Route>
      </Route>
    </> // *** Closing Fragment Tag ***
  )
);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
