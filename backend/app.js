// backend/app.js
import express from "express";
import dotenv from "dotenv";
import colors from "colors"; // Assuming you want to keep this for console logs
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

// Import routes
import userRoutes from "./routes/authRoutes.js"; // Correct import for your user routes
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js"; // <<< NEW: Import seller routes

import cors from "cors";

dotenv.config();

connectDB();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests only from your frontend's origin
    credentials: true, // Allow cookies to be sent with requests (crucial for JWT)
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/sellers", sellerRoutes); // <<< NEW: Mount seller routes

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
