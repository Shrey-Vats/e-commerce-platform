// backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    label: { type: String }, // e.g. 'Home', 'Work', etc.
  },
  { _id: false }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // NEW FIELDS FOR SELLER SYSTEM
    isSeller: {
      type: Boolean,
      required: true,
      default: false, // Default to false, users are not sellers by default
    },
    brandName: {
      type: String,
    },
    location: {
      type: String,
    },
    addresses: [addressSchema], // Array of addresses
    defaultAddress: { type: Number, default: 0 }, // Index in addresses array
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // If password is not modified, move to the next middleware
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
