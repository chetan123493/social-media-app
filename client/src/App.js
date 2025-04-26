import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Post from './components/Post';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute'; // Protects routes
import ChatPage from './components/ChatPage';  // Import ChatPage here
import UserProfile from './components/User';  // Import UserProfile here
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
import Messages from './components/Messages';


const App = () => {
  return (
    <Routes>
      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes using PrivateRoute */}
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      <Route path="/feed" element={<PrivateRoute element={<Feed />} />} />
      <Route path="/post/:id" element={<PrivateRoute element={<Post />} />} />
      <Route path="/chat/:userId" element={<PrivateRoute element={<ChatPage />} />} />

      {/* UserProfile Route */}
      <Route 
        path="/profile/:userId" 
        element={
          <PrivateRoute element={<UserProfileWrapper />} />
        }
      />

      {/* Messages Route */}
      <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
      <Route path="/messages/:userId" element={<PrivateRoute element={<ChatPage />} />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Wrapper component to pass userId to UserProfile
const UserProfileWrapper = () => {
  const { userId } = useParams(); // Get userId from URL params
  return <UserProfile userId={userId} />;
};

export default App;
