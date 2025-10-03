import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage'; // Import the new AuthPage
import LearnPage from './pages/LearnPage';
import TutorPage from './pages/TutorPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

import initialCourses from './data/courses.json';
import initialUsers from './data/users.json'; // Import initial users

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState(initialCourses);
  const [users, setUsers] = useState(initialUsers); // Manage all users in state

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleAddCourse = (newCourse) => {
    setCourses(prevCourses => [newCourse, ...prevCourses]);
  };
  
  // New function to handle user registration
  const handleSignUp = (newUser) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* This route now handles both login and signup */}
          <Route 
            path="/login" 
            element={!isLoggedIn ? <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} users={users} /> : <Navigate to="/learn" />} 
          />
          
          <Route path="/learn" element={isLoggedIn ? <LearnPage courses={courses} /> : <Navigate to="/login" />} />
          <Route path="/tutor" element={isLoggedIn ? <TutorPage onAddCourse={handleAddCourse} currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route 
            path="/profile" 
            element={isLoggedIn ? <ProfilePage user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;