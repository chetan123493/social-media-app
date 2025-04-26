import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios'; // Import axios for API calls

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);  // Store user data
  const [loading, setLoading] = useState(true);    // Handle loading state
  const [posts, setPosts] = useState([]);          // Store posts data
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [editingProfile, setEditingProfile] = useState(false); // Flag to toggle edit mode
  const [bioInput, setBioInput] = useState('');    // Bio input for editing
  const [profilePic, setProfilePic] = useState(''); // Profile picture for editing

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId'); // Ensure userId is in localStorage

    if (!token) {
      navigate('/login');
    } else if (storedUserId) {
      setUserId(storedUserId); // Set the userId if available
      fetchUserData(storedUserId);  // Fetch user data if userId is available
      fetchPosts();  // Fetch posts
      fetchNotifications();  // Fetch notifications
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUserData(response.data);
      setLoading(false);  // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching user data', error);
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');  // Example endpoint for posts
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');  // Example endpoint for notifications
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleProfileEdit = () => {
    setEditingProfile(!editingProfile);  // Toggle edit mode
    if (userData) {
      setBioInput(userData.bio || '');  // Prepopulate bio input
      setProfilePic(userData.profilePicture || ''); // Prepopulate profile picture
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const updatedData = { bio: bioInput, profilePicture: profilePic };
      const response = await axios.put(`/api/users/${userId}`, updatedData);  // API endpoint to update user profile
      setUserData(response.data);
      setEditingProfile(false);  // Exit edit mode
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);  // API endpoint to delete post
      setPosts(posts.filter(post => post.id !== postId));  // Remove post from local state
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* Sidebar with profile info and navigation */}
        <div className="profile-info">
          {loading ? (
            <p>Loading...</p>
          ) : (
            userData && (
              <div>
                <img src={userData.profilePicture} alt={userData.username} className="profile-picture" />
                <h3>{userData.username}</h3>
                <p>{userData.email}</p>
                <p>{userData.location}</p>
                <p>{userData.occupation}</p>
                <p>{userData.bio}</p>
              </div>
            )
          )}
        </div>
        <div className="sidebar-links">
          <Link to="/feed">Feed</Link>
          <Link to="/post/1">Posts</Link> {/* Updated link to view posts */}
          <Link to="/notifications">Notifications</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <h2>Welcome to Your Dashboard!</h2>
          <p>This is your main page for managing content, feed, and posts.</p>
        </header>

        <div className="feed-section">
          <h3>Your Feed</h3>
          {/* Render posts dynamically */}
          {posts.length === 0 ? (
            <p>No posts to display yet.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post">
                <h4>{post.username} posted:</h4>
                <p>{post.body}</p>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </div>
            ))
          )}
        </div>

        <div className="notifications-section">
          <h3>Notifications</h3>
          {/* Render notifications dynamically */}
          {notifications.length === 0 ? (
            <p>No notifications.</p>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className="notification">
                <p>{notification.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Profile Edit Section */}
        <div className="profile-edit-section">
          <h3>Edit Your Profile</h3>
          <button onClick={handleProfileEdit}>
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </button>

          {editingProfile && (
            <div className="edit-profile-form">
              <label>
                Bio:
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                />
              </label>
              <label>
                Profile Picture URL:
                <input
                  type="text"
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                />
              </label>
              <button onClick={handleProfileUpdate}>Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
