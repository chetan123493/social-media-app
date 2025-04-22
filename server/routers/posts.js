const express = require('express');
const Post = require('../models/Post');
const authenticateToken = require('../middleware/auth'); // Import the JWT authentication middleware
const router = express.Router();

// GET /api/posts - Fetch all posts (secured with token authentication)
// GET /api/posts - Fetch all posts (secured with token authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find() // Fetch all posts
      .populate('userId', 'username') // Populate the userId with only the username
      .exec();
    res.status(200).json(posts); // Send all posts as JSON response
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});




// POST /api/posts - Create a new post (secured with token authentication)
router.post('/', authenticateToken, async (req, res) => {
  const { content, imageUrl } = req.body;
  const userId = req.user._id; // Ensure this comes from the JWT token

  if (!content) {
    return res.status(400).json({ message: 'Content is required.' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User not authenticated.' });
  }

  try {
    // Create a new post object
    const newPost = new Post({
      content,
      image: imageUrl,  // Optional image URL
      userId: userId,   // Associate post with the authenticated user
    });

    // Save the post to the database
    await newPost.save();

    // Respond with the newly created post
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Error creating post, please try again.' });
  }
});

// DELETE /api/posts/:id - Delete a post (secured with token authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  console.log(`Attempting to delete post with ID: ${id}`);
  console.log(`Authenticated user ID: ${userId}`);

  try {
    const post = await Post.findById(id);
    if (!post) {
      console.log('Post not found.');
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId.toString() !== userId.toString()) {
      console.log('User does not own this post.');
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }

    await post.deleteOne();
    console.log('Post deleted successfully');
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Error deleting post, please try again.' });
  }
});

module.exports = router;  // Export the router for use in your server.js
