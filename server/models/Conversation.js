const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  history: [
    {
      role: { type: String, enum: ['user', 'bot'], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
