import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout'; // Import the Layout component
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <Layout> {/* Layout will wrap Feed and show the footer */}
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
    </Layout>
  );
};

export default Feed;
