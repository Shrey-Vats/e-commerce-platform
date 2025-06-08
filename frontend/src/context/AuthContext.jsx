import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios"; // We'll use axios for API calls
import { toast } from "react-toastify"; // For user notifications

// Create the Auth Context
const AuthContext = createContext();

// Initial state for the authentication reducer
const initialState = {
  userInfo: localStorage.getItem("userInfo") // Load user info from localStorage on initial load
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  loading: false,
  error: null,
};

// Reducer function to manage authentication state
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("userInfo", JSON.stringify(action.payload)); // Save user info to localStorage
      return { ...state, loading: false, userInfo: action.payload };
    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        userInfo: null,
      };
    case "LOGOUT":
      localStorage.removeItem("userInfo"); // Remove user info from localStorage
      return { ...state, userInfo: null };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Function to handle user login
  const login = async (email, password) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      toast.success("Logged in successfully!");
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: "LOGIN_FAIL", payload: message });
      toast.error(message);
    }
  };

  // Function to handle user registration
  const register = async (name, email, password) => {
    dispatch({ type: "REGISTER_REQUEST" });
    try {
      const { data } = await axios.post("/api/users", {
        name,
        email,
        password,
      });
      dispatch({ type: "REGISTER_SUCCESS", payload: data });
      toast.success("Registration successful!");
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: "REGISTER_FAIL", payload: message });
      toast.error(message);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
      dispatch({ type: "LOGOUT" });
      toast.info("Logged out successfully!");
    } catch (error) {
      // Even if logout fails on server, clear client-side state
      dispatch({ type: "LOGOUT" });
      toast.error(
        "Error logging out, but you have been logged out client-side."
      );
    }
  };

  // Expose the state and functions through the context value
  const value = {
    userInfo: state.userInfo,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
