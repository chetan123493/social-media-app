const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');  // Import the User model to get usernames
const authMiddleware = require('../middleware/auth');

// Send a message
router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;

  // Debugging to ensure req.user is correctly populated
  console.log('Authenticated user:', req.user); // Ensure req.user contains user data

  if (!req.user) {
    return res.status(400).json({ error: 'Sender (user) not authenticated' });
  }

  // Ensure the receiverId and content are provided in the body
  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Receiver ID and message content are required' });
  }

  // Create the new message
  const newMessage = new Message({
    sender: req.user._id,  // Use req.user._id
    receiver: receiverId,   // Receiver from request body
    content,               // Content from request body
  });

  try {
    const savedMessage = await newMessage.save();
    console.log('Saved message:', savedMessage);  // Log to confirm the message is saved
    res.json(savedMessage);  // Send back the saved message
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: `Error saving message: ${err.message}` });
  }
});

// Get all messages with a specific user (for chat page)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    // Fetch messages between the authenticated user and the specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate('sender receiver', 'username');  // Populate sender and receiver with their username

    // Find the other user's data to show at the top of the chat
    const otherUserId = req.params.userId;
    const otherUser = await User.findById(otherUserId, 'username'); // Fetch the username of the other user

    res.json({
      messages,      // Send the messages
      otherUser,     // Send the other user's info (username)
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

module.exports = router;
