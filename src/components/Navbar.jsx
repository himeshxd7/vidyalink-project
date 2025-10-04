import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ isLoggedIn, notifications, currentUser, courses }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
      'vidyalink_theme',
      document.body.classList.contains('dark-mode') ? 'dark-mode' : ''
    );
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('vidyalink_theme');
    if (savedTheme === 'dark-mode') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        VidyaLink
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/">
          <i className="fas fa-home"></i> Home
        </NavLink>
        <NavLink to="/about">
          <i className="fas fa-info-circle"></i> About
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink to="/learn">
              <i className="fas fa-book-open"></i> Learn
            </NavLink>
            <NavLink to="/tutor">
              <i className="fas fa-chalkboard-teacher"></i> Tutor
            </NavLink>
          </>
        )}
      </div>
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <div className="notification-container">
              {notifications && notifications.length > 0 && (
                <button
                  className="notification-icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="fas fa-bell"></i>
                  <span className="notification-count">{notifications.length}</span>
                </button>
              )}
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  courses={courses}
                  currentUser={currentUser}
                />
              )}
            </div>
            <NavLink to="/profile" className="profile-link">
              <img
                src={currentUser?.pfp || 'https://i.pravatar.cc/150'}
                alt="Profile"
                className="profile-pic-nav"
              />
            </NavLink>
          </>
        ) : (
          <NavLink to="/login" className="get-started-btn">
            Get Started
          </NavLink>
        )}
        <button
          onClick={toggleDarkMode}
          className="dark-mode-toggle"
          title="Toggle Dark Mode"
        >
          <i className="fas fa-moon"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;