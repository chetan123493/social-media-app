import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css'; // Import updated CSS

const Layout = ({ children }) => {
  const [isShrunk, setIsShrunk] = useState(true); // Start with footer shrunk
  const [hovered, setHovered] = useState(false); // Track if footer is being hovered
  const navigate = useNavigate();
  let timer; // Store the timer to clear when needed

  // Shrink the footer after 2 seconds of inactivity
  const startShrinkTimer = () => {
    if (!hovered) {
      timer = setTimeout(() => {
        setIsShrunk(true); // Shrink footer after 2 seconds of no hover
      }, 2000);
    }
  };

  // Expand the footer on hover
  const handleMouseEnter = () => {
    setHovered(true);
    setIsShrunk(false); // Expand the footer immediately
    clearTimeout(timer); // Clear any pending shrink timers
  };

  // Shrink the footer after mouse leaves
  const handleMouseLeave = () => {
    setHovered(false);
    startShrinkTimer(); // Start shrink timer after mouse leaves
  };

  // Start the shrink timer when the page loads
  useEffect(() => {
    startShrinkTimer(); // Automatically start shrinking when the page loads

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [hovered]); // Re-run the effect whenever `hovered` changes

  return (
    <div className="layout-container">
      <div className="content">
        {children}  {/* Main page content */}
      </div>

      {/* Footer - fixed at the bottom */}
      <footer 
        className={`feed-footer ${isShrunk ? 'shrunk' : ''}`} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="footer-links">
          <Link to="/dashboard">
            <i className="fas fa-user"></i> Profile
          </Link>
          <Link to="/post/1">
            <i className="fas fa-file-alt"></i> Posts
          </Link>
          <Link to="/feed">
            <i className="fas fa-home"></i> Feed
          </Link>
          <Link to="/notifications">
            <i className="fas fa-bell"></i> Notifications
          </Link>

          {/* Logout link */}
          <Link to="/login" className="logout-link" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login'); // Redirect to login page
          }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </div>

        {/* Arrow icon to restore footer size */}
        <div className="footer-arrow" onClick={() => setIsShrunk(false)}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
