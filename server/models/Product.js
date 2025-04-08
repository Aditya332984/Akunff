const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  platform: {
    type: String,
    required: true,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'],
  },
  genre: { type: String, required: true },
  gameId: { type: String, trim: true }, // New field for game ID
  image: { type: String }, // Added for image URL
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);