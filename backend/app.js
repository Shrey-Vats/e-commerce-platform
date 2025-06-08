import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";

dotenv.config(); // Load environment variables from .env file

connectDB(); // Connect to MongoDB

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
