// server/routes/reviewRoutes.js
const express = require("express");
const Review = require("../models/Review");
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new review (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, text, rating, userId } = req.body;

    if (!text || !rating || !productId || !userId) {
      return res.status(400).json({ error: "All fields (productId, text, rating, userId) are required" });
    }

    // Ensure the userId matches the authenticated user
    if (userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: User ID does not match authenticated user" });
    }

    const newReview = new Review({
      productId,
      text,
      rating,
      user: userId,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;