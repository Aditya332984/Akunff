// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// @desc Get user data
// @route GET /api/users/me
router.get("/me", authMiddleware, async (req, res) => {
  console.log("Decoded user from token:", req.user); // Should show { id: ... }

  try {
    const user = await User.findById(req.user.id).select("-password"); // Remove password from response
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// @desc Update user password
// @route PUT /api/users/update-password
router.put("/update-password", authMiddleware, async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.password = password; // In production, hash this password before saving!
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// @desc Delete user
// @route DELETE /api/users/delete
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (user) {
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
