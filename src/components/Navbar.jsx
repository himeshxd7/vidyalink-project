import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ isLoggedIn, notifications, currentUser, courses, showLoader }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    showLoader();
    document.body.classList.toggle('dark-mode');
    const darkMode = document.body.classList.contains('dark-mode');
    setIsDarkMode(darkMode);
    localStorage.setItem(
      'vidyalink_theme',
      darkMode ? 'dark-mode' : ''
    );
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('vidyalink_theme');
    if (savedTheme === 'dark-mode' || savedTheme === null) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
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
            <span className="icon">→</span>
          </NavLink>
        )}
        <div className="toggle-switch">
          <label className="switch-label">
            <input
              type="checkbox"
              className="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;