import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Avatar, Button } from '@mui/material';

const UserProfile = ({ userId: propUserId }) => {
  const params = useParams();
  const userId = propUserId || params.userId;

  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        console.error('No userId provided.');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching user profile for userId: ${userId}`);
        const response = await axios.get(`/api/users/${userId}`);
        console.log('User data:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await axios.post('/api/follow', {
        followerId: localStorage.getItem('userId'),
        followingId: userId,
      });
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error.response?.data || error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post('/api/unfollow', {
        followerId: localStorage.getItem('userId'),
        followingId: userId,
      });
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error.response?.data || error.message);
    }
  };

  if (loading) {
    console.log("Loading user profile...");
    return <CircularProgress />;
  }

  if (!userData) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <div>
      <Avatar src={userData.profilePicture || '/default-avatar.jpg'} alt={userData.username} />
      <Typography variant="h5">{userData.username || 'Anonymous'}</Typography>
      <Typography variant="body1">{userData.bio || 'No bio available'}</Typography>

      {isFollowing ? (
        <Button variant="contained" color="secondary" onClick={handleUnfollow}>
          Unfollow
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleFollow}>
          Follow
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
