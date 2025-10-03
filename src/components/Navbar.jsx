import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
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