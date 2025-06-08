// ... (imports) ...

// Admin Pages
import AdminDashboard from "../pages/AdminDashboard";
import ProductListScreen from "../pages/ProductListScreen"; // Import new page
import ProductEditScreen from "../pages/ProductEditScreen"; // Import new page
// ... (other imports) ...

const router = createBrowserRouter(
  createRoutesFromElements(
    // ... (Main Layout Route) ...

    // Admin Layout Route (admin-specific routes)
    <Route path="/admin" element={<AdminLayout />}>
      {/* Admin Protected Routes (requires admin login) */}
      <Route path="" element={<AdminRoute />}>
        <Route index={true} element={<AdminDashboard />} />{" "}
        {/* Admin Dashboard home */}
        <Route path="products" element={<ProductListScreen />} />{" "}
        {/* New: Product List */}
        <Route path="product/:id/edit" element={<ProductEditScreen />} />{" "}
        {/* New: Product Edit */}
        {/* Add more admin routes here (e.g., /admin/orders, /admin/users) */}
      </Route>
    </Route>
  )
);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
