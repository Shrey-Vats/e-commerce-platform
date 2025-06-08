// ... (imports) ...

// Admin Pages
import AdminDashboard from "../pages/AdminDashboard";
import ProductListScreen from "../pages/ProductListScreen";
import ProductEditScreen from "../pages/ProductEditScreen";
import OrderListScreen from "../pages/OrderListScreen"; // Import new page
import OrderDetailsScreen from "../pages/OrderDetailsScreen"; // Import new page
// ... (other imports) ...

const router = createBrowserRouter(
  createRoutesFromElements(
    // ... (Main Layout Route) ...

    // Admin Layout Route (admin-specific routes)
    <Route path="/admin" element={<AdminLayout />}>
      {/* Admin Protected Routes (requires admin login) */}
      <Route path="" element={<AdminRoute />}>
        <Route index={true} element={<AdminDashboard />} />
        <Route path="products" element={<ProductListScreen />} />
        <Route path="product/:id/edit" element={<ProductEditScreen />} />
        <Route path="orders" element={<OrderListScreen />} />{" "}
        {/* New: Order List */}
        <Route path="order/:id" element={<OrderDetailsScreen />} />{" "}
        {/* New: Order Details */}
        {/* You could add a UserListScreen here as well for admin users */}
      </Route>
    </Route>
  )
);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
