import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  // --- THIS FUNCTION IS UPDATED FOR DARK MODE ---
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