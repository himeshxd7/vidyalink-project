import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isLoggedIn, notifications }) => {
  const toggleDarkMode = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('vidyalink_theme', ''); // Set to light mode
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('vidyalink_theme', 'dark-mode'); // Set to dark mode
    }
  };

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">VidyaLink</NavLink>
      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        {isLoggedIn && (
          <>
            <NavLink to="/learn">Learn</NavLink>
            <NavLink to="/tutor">Tutor</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}
      </div>
      <div className="navbar-actions">
        {isLoggedIn && notifications && notifications.length > 0 && (
          <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            <span className="notification-count">{notifications.length}</span>
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.map((notif, index) => (
                  <div key={index} className="notification-item">
                    <p><strong>Course:</strong> {notif.courseId}</p>
                    <p>{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!isLoggedIn ? (
          <NavLink to="/login" className="get-started-btn">Get Started</NavLink>
        ) : (
          <NavLink to="/profile" className="get-started-btn">Profile</NavLink>
        )}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">🌙</button>
      </div>
    </nav>
  );
};

export default Navbar;