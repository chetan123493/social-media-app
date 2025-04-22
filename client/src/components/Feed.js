// Feed.js (Frontend)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import './Feed.css'; // Import the CSS file for styling

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token'); // Get token from localStorage

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` }, // Add token to request headers
        })
        .then((response) => {
          setPosts(response.data); // Set posts to state
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // If no token, redirect to login
      window.location.href = '/login'; // Redirect user to login if not logged in
    }
  }, [token]);

  return (
    <div className="feed-container">
      <div className="feed-content">
        <h2>Feed</h2>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id} className="post-item">
              <div className="post-card">
                <p>
                  <Link to={`/chat/${post.userId?._id}`} className="username-link">
                    <strong>{post.userId?.username}</strong>
                  </Link>{' '}
                  posted:
                </p>
                <p className="post-content">{post.content}</p>
                {post.image && <img className="post-image" src={post.image} alt="Post" />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Feed;
