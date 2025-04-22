import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect user to login page
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Welcome to the Dashboard!</h2>
        <p>This is a protected page where you can manage your content.</p>
        
        <Link to="/feed" className="go-to-feed-btn">
          Go to Feed
        </Link>
        <br />
        <Link to="/post/1">Go to Post 1</Link>

        {/* Logout button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
