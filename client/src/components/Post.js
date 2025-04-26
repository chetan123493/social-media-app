import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Post.css';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // State for holding posts
  const [userId, setUserId] = useState(null); // State to hold the logged-in user's ID

  // Fetch the logged-in user's ID from the token (assuming it's stored in localStorage)
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
      return decodedToken.userId; // Assuming the JWT contains userId
    }
    return null;
  };

  // Fetch posts from the API
  const fetchPosts = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      setError('User not logged in.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });

      // Set the posts in state
      setPosts(response.data); // Response will contain all posts for this user
    } catch (err) {
      setError('Error fetching posts, please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content is required!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        { content, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Optimistic update: Add the new post to the existing posts
      setPosts((prevPosts) => [...prevPosts, response.data]); // Assuming response.data contains the new post
      setContent('');
      setImageUrl('');
      setError(null);
      alert('Post created');
    } catch (err) {
      setError('Error creating post, please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Remove the deleted post from the posts state
      setPosts(posts.filter((post) => post._id !== postId));
      alert('Post deleted successfully');
    } catch (err) {
      alert('Error deleting post');
      console.error(err);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <h3>My Posts</h3>
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {/* Display the username of the user who posted */}
              <p><strong>{post.userId?.username}</strong> posted:</p>
              <p>{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Post Image" className="post-image" />
              )}
              <button
                className="delete-button"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
