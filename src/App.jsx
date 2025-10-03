import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import LearnPage from './pages/LearnPage';
import TutorPage from './pages/TutorPage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailPage from './pages/CourseDetailPage';
import ChatPage from './pages/ChatPage'; // Import the new ChatPage component
import './App.css';

import initialCourses from './data/courses.json';
import initialUsers from './data/users.json';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('vidyalink_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(currentUser));
  const [courses, setCourses] = useState(initialCourses);
  const [users, setUsers] = useState(initialUsers);
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const savedEnrolledCourses = localStorage.getItem('vidyalink_enrolled_courses');
    return savedEnrolledCourses ? JSON.parse(savedEnrolledCourses) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vidyalink_user', JSON.stringify(currentUser));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('vidyalink_user');
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vidyalink_enrolled_courses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  // --- THIS IS THE NEW CODE FOR DARK MODE ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('vidyalink_theme');
    if (savedTheme) {
      document.body.className = savedTheme;
    } else {
      // If no theme is saved, default to dark mode
      document.body.className = 'dark-mode';
      localStorage.setItem('vidyalink_theme', 'dark-mode');
    }
  }, []); // Empty array ensures this runs only once on app load

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddCourse = (newCourse) => {
    setCourses(prevCourses => [newCourse, ...prevCourses]);
  };
  
  const handleUpdateCourse = (updatedCourse) => {
    setCourses(courses.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const handleSignUp = (newUser) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleEnroll = (course) => {
    if (!enrolledCourses.find(c => c.id === course.id)) {
      setEnrolledCourses([...enrolledCourses, course]);
    }
  };

  const handleUnenroll = (courseId) => {
    setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
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
          
          <Route 
            path="/course/:id" 
            element={isLoggedIn ? <CourseDetailPage courses={courses} onEnroll={handleEnroll} enrolledCourses={enrolledCourses} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/tutor" 
            element={isLoggedIn ? <TutorPage onAddCourse={handleAddCourse} onUpdateCourse={handleUpdateCourse} currentUser={currentUser} courses={courses} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tutor/:id" 
            element={isLoggedIn ? <TutorPage onAddCourse={handleAddCourse} onUpdateCourse={handleUpdateCourse} currentUser={currentUser} courses={courses} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/profile" 
            element={isLoggedIn ? <ProfilePage user={currentUser} onLogout={handleLogout} courses={courses} onDeleteCourse={handleDeleteCourse} enrolledCourses={enrolledCourses} onUnenroll={handleUnenroll} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/chat/:tutorId"
            element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;