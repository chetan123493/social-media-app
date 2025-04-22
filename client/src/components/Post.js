// Post.js (Frontend)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Post.css';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // State for holding posts

  // Fetch posts when the component loads or after a new post is created
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(response.data); // Set the posts data from the response
    } catch (err) {
      setError('Error fetching posts, please try again.');
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
      setPosts((prevPosts) => [...prevPosts, response.data]); // Optimistic update
      alert('Post created');
      setContent('');
      setImageUrl('');
      setError(null);
    } catch (err) {
      setError('Error creating post, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setPosts(posts.filter((post) => post._id !== postId)); // Remove deleted post from state
      alert('Post deleted successfully');
    } catch (err) {
      alert('Error deleting post');
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
