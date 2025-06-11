import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    recentOrders: [],
    recentProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // You may need to adjust endpoints according to your backend
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          apiClient.get("/api/users"),
          apiClient.get("/api/products"),
          apiClient.get("/api/orders"),
        ]);
        const totalUsers = usersRes.data.length;
        const totalProducts = productsRes.data.products
          ? productsRes.data.products.length
          : productsRes.data.length;
        const totalOrders = ordersRes.data.length;
        const totalSales = ordersRes.data.reduce(
          (sum, o) => sum + (o.totalPrice || 0),
          0
        );
        const recentOrders = ordersRes.data.slice(-5).reverse();
        const recentProducts = productsRes.data.products
          ? productsRes.data.products.slice(-5).reverse()
          : productsRes.data.slice(-5).reverse();
        setStats({
          totalUsers,
          totalProducts,
          totalOrders,
          totalSales,
          recentOrders,
          recentProducts,
        });
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
    fetchStats();
  }, []);

  return { ...stats, loading, error };
};

export default useAdminDashboard;
