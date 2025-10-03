import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../data/users.json';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
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

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign In</h2>
        <p>Use your college PRN and password to log in.</p>
        <div className="form-group">
          <label htmlFor="username">PRN (Username)</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign In</button>
        <p className="form-footer">Do you have an account? Sign in</p>
      </form>
    </div>
  );
};

export default LoginPage;