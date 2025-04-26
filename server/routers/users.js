const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');  // Import your User model
const router = express.Router();



router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Fetch user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Follow a user
router.post('/follow', async (req, res) => {
    const { followerId, followingId } = req.body;
  
    // Check if the provided IDs are valid
    if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
  
    try {
      const follower = await User.findById(followerId);
      const following = await User.findById(followingId);
  
      if (!follower || !following) {
        return res.status(404).json({ message: 'User(s) not found' });
      }
  
      if (follower.following.includes(followingId)) {
        return res.status(400).json({ message: 'You are already following this user' });
      }
  
      follower.following.push(followingId);
      following.followers.push(followerId);
  
      await follower.save();
      await following.save();
  
      res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Unfollow a user
  router.post('/unfollow', async (req, res) => {
    const { followerId, followingId } = req.body;
  
    // Check if the provided IDs are valid
    if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
  
    try {
      const follower = await User.findById(followerId);
      const following = await User.findById(followingId);
  
      if (!follower || !following) {
        return res.status(404).json({ message: 'User(s) not found' });
      }
  
      if (!follower.following.includes(followingId)) {
        return res.status(400).json({ message: 'You are not following this user' });
      }
  
      follower.following = follower.following.filter(id => id.toString() !== followingId);
      following.followers = following.followers.filter(id => id.toString() !== followerId);
  
      await follower.save();
      await following.save();
  
      res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
