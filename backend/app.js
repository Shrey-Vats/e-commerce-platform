// backend/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON data

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("MERN Backend is running!");
});

// You'll add your API routes here later
// Example: app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
