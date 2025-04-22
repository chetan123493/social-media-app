const express = require('express');
const router = express.Router();
const Message = require('../models/Message');  // Ensure your model is correctly imported
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;

  // Debug: Check if req.user is available
  console.log('Authenticated user:', req.user);

  if (!req.user) {
    return res.status(400).json({ error: 'Sender (user) not authenticated' });
  }

  // Create the new message
  const newMessage = new Message({
    sender: req.user.id, // The sender is the authenticated user
    receiver: receiverId, // Receiver from request body
    content,              // Content from request body
  });

  try {
    const savedMessage = await newMessage.save();
    res.json(savedMessage);  // Send back the saved message
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: `Error saving message: ${err.message}` });
  }
});


// Get all messages with a specific user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    }).populate('sender receiver', 'username');  // Optionally populate sender and receiver fields

    res.json(messages);  // Return the fetched messages
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

module.exports = router;
