import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/api/orders/myorders");
        setOrders(data);
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
    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export default useUserOrders;
