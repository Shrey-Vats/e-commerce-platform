import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", // Use environment variable or default
  withCredentials: true, // This is crucial for sending and receiving HTTP-only cookies (like your JWT)
});

// Optional: Add request or response interceptors here if needed for global error handling, headers, etc.
// For example, to handle errors globally:
/*
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific error codes here, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      // Logic to clear user data or redirect to login
      console.log('Unauthorized request, potentially redirecting to login...');
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/

export default apiClient;
