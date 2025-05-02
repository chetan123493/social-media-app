import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

  useEffect(() => {
    // Fetch the updated user data from the server
    axios
      .get('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data); // Update user data from backend
      })
      .catch((err) => {
        console.error('Failed to fetch user profile:', err);
      });
  }, [token]); // Re-fetch data when the token changes

  return (
    <div className="dashboard">
      {userData ? (
        <div className="profile-box">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="dashboard-profile-pic"
          />
          <h2>{userData.username}</h2>
          <p>{userData.bio}</p>
          <div className="dashboard-buttons">
            <button onClick={() => navigate('/followers')}>Followers</button>
            <button onClick={() => navigate('/following')}>Following</button>
            {/* Add a button to navigate to Userprofile page */}
            <button onClick={() => navigate('/user-profile')}>Go to User Profile</button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Dashboard;
