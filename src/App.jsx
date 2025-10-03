import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import LearnPage from './pages/LearnPage';
import TutorPage from './pages/TutorPage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailPage from './pages/CourseDetailPage';
import EditCoursePage from './pages/EditCoursePage'; // Import the new page
import './App.css';

import initialCourses from './data/courses.json';
import initialUsers from './data/users.json';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState(initialCourses);
  const [users, setUsers] = useState(initialUsers);

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
  
  const handleSignUp = (newUser) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleUpdateCourse = (updatedCourse) => {
    setCourses(courses.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route 
            path="/login" 
            element={!isLoggedIn ? <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} users={users} /> : <Navigate to="/learn" />} 
          />
          
          <Route path="/learn" element={isLoggedIn ? <LearnPage courses={courses} /> : <Navigate to="/login" />} />
          
          <Route path="/course/:id" element={isLoggedIn ? <CourseDetailPage courses={courses} /> : <Navigate to="/login" />} />

          <Route path="/tutor" element={isLoggedIn ? <TutorPage onAddCourse={handleAddCourse} currentUser={currentUser} /> : <Navigate to="/login" />} />

          <Route 
            path="/profile" 
            element={isLoggedIn ? <ProfilePage user={currentUser} onLogout={handleLogout} courses={courses} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/edit-course/:id" 
            element={isLoggedIn ? <EditCoursePage courses={courses} onUpdateCourse={handleUpdateCourse} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;