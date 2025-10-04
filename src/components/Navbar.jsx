import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isLoggedIn, notifications, currentUser }) => {
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
      'vidyalink_theme',
      document.body.classList.contains('dark-mode') ? 'dark-mode' : ''
    );
  };

  // Set initial theme
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
            {notifications && notifications.length > 0 && (
              <NavLink to="/profile" className="notification-icon" title="Notifications">
                <i className="fas fa-bell"></i>
                <span className="notification-count">{notifications.length}</span>
              </NavLink>
            )}
            <NavLink to="/profile" className="profile-link">
              <img src={currentUser?.pfp || 'https://i.pravatar.cc/150'} alt="Profile" className="profile-pic-nav" />
            </NavLink>
          </>
        ) : (
          <NavLink to="/login" className="get-started-btn">
            Get Started
          </NavLink>
        )}
        <button onClick={toggleDarkMode} className="dark-mode-toggle" title="Toggle Dark Mode">
          <i className="fas fa-moon"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;