import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onLogin, onSignUp, users }) => {
  const [isSigningIn, setIsSigningIn] = useState(false); // Start with Sign Up page
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setError('');
      onLogin(user);
      navigate('/learn');
    } else {
      setError('Invalid PRN or password.');
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (password.length !== 6) {
      setError('Password must be exactly 6 digits.');
      return;
    }
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      setError('This PRN is already registered. Please sign in.');
      return;
    }
    const newUser = { username, password };
    onSignUp(newUser);
    onLogin(newUser); // Automatically log in after sign up
    navigate('/learn');
  };

  const toggleForm = () => {
    setIsSigningIn(!isSigningIn);
    setError(''); // Clear errors when switching forms
  };

  return (
    <div className="login-container">
      {isSigningIn ? (
        // Sign In Form
        <form onSubmit={handleSignInSubmit} className="login-form">
          <h2>Sign In</h2>
          <p>Use your college PRN and password to log in.</p>
          <div className="form-group">
            <label htmlFor="username">PRN (Username)</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Sign In</button>
          <p className="form-footer" onClick={toggleForm}>
            Don't have an account? <span>Sign Up</span>
          </p>
        </form>
      ) : (
        // Sign Up Form
        <form onSubmit={handleSignUpSubmit} className="login-form">
          <h2>Sign Up</h2>
          <p>Create a new profile with your college PRN.</p>
           <div className="form-group">
            <label htmlFor="username">PRN (Username)</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">6-Digit Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required maxLength="6" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Create Account</button>
          <p className="form-footer" onClick={toggleForm}>
            Do you have an account? <span>Sign in</span>
          </p>
        </form>
      )}
    </div>
  );
};

export default AuthPage;