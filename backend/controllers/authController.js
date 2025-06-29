// @desc    Promote user to seller (Admin only)
// @route   PATCH /api/users/:id/make-seller
// @access  Private/Admin
import asyncHandler from "express-async-handler"; // A simple middleware for handling exceptions inside of async express routes
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
const makeSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isSeller = true;
  await user.save();
  res.json({ message: `User ${user.name} is now a seller.`, isSeller: true });
});
// @desc    Get all addresses for the user
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      addresses: user.addresses || [],
      defaultAddress: user.defaultAddress || 0,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addresses = user.addresses || [];
    user.addresses.push(req.body);
    // If this is the first address, set as default
    if (user.addresses.length === 1) user.defaultAddress = 0;
    await user.save();
    res
      .status(201)
      .json({ addresses: user.addresses, defaultAddress: user.defaultAddress });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update an address
// @route   PUT /api/users/addresses/:idx
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = parseInt(req.params.idx, 10);
  if (user && user.addresses && user.addresses[idx]) {
    user.addresses[idx] = req.body;
    await user.save();
    res.json({
      addresses: user.addresses,
      defaultAddress: user.defaultAddress,
    });
  } else {
    res.status(404);
    throw new Error("Address not found");
  }
});

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:idx
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = parseInt(req.params.idx, 10);
  if (user && user.addresses && user.addresses[idx] !== undefined) {
    user.addresses.splice(idx, 1);
    // Adjust defaultAddress if needed
    if (user.defaultAddress >= user.addresses.length) {
      user.defaultAddress = 0;
    }
    await user.save();
    res.json({
      addresses: user.addresses,
      defaultAddress: user.defaultAddress,
    });
  } else {
    res.status(404);
    throw new Error("Address not found");
  }
});

// @desc    Set default address
// @route   PUT /api/users/addresses/default/:idx
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = parseInt(req.params.idx, 10);
  if (user && user.addresses && user.addresses[idx]) {
    user.defaultAddress = idx;
    await user.save();
    res.json({
      addresses: user.addresses,
      defaultAddress: user.defaultAddress,
    });
  } else {
    res.status(404);
    throw new Error("Address not found");
  }
});


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); // Generate JWT and set as HTTP-only cookie

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook in the User model
  });

  if (user) {
    generateToken(res, user._id); // Generate JWT and set as HTTP-only cookie

    res.status(201).json({
      // Created
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry to past to clear the cookie
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by the authMiddleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404); // Not Found
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // Password will be hashed by the pre-save hook
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); // Exclude password

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id }); // Use deleteOne instead of remove
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin); // Ensure boolean type

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  makeSeller,
};
