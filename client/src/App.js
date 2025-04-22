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
      <Route path="/chat/:userId" element={<ChatPage />} />  {/* Use element instead of component */}

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
