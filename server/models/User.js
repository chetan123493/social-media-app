const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  // Other fields you may have
});

const User = mongoose.model('User', userSchema);

module.exports = User;
