import express from "express";
import dotenv from "dotenv";
import colors from "colors"; // Assuming you want to keep this for console logs
import cookieParser from "cookie-parser"; // Import cookie-parser
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js"; // Correct import for your error handlers

// Import routes
import userRoutes from "./routes/authRoutes.js"; // Correct import for your user routes
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors"; // <<< ADD THIS LINE: Import the cors package

dotenv.config();

connectDB();

const app = express();

// <<< ADD THIS BLOCK: CORS Configuration >>>
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests only from your frontend's origin
    credentials: true, // Allow cookies to be sent with requests (crucial for JWT)
  })
);
// <<< END ADD THIS BLOCK >>>

// Body parser middleware
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(express.urlencoded({ extended: true })); // Allows parsing of URL-encoded form data

// Cookie parser middleware
app.use(cookieParser()); // Enables parsing of cookies from the request headers

// Mount routes
app.use("/api/users", userRoutes); // Your userRoutes are named authRoutes.js but mounted as /api/users
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

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
