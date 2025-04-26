// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  googleId: {type:String, unique:true,sparse:true},
  email: { type: String, unique: true, required: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastseen:{
    type: Date,
    default: Date.now,
  },
  lastChatOpened:Date,
});

module.exports = mongoose.model('User', userSchema);