import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="page-content">
      <h1>Your Profile</h1>
      <div className="profile-details">
        <p><strong>Username (PRN):</strong> {user?.username}</p>
        <h3>Courses Enrolled</h3>
        <p>This feature is coming soon!</p>
      </div>
      <button onClick={handleLogoutClick} className="logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default ProfilePage;