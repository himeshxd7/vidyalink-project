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
import TutorChatPage from './pages/TutorChatPage';
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
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('vidyalink_messages');
    return savedMessages ? JSON.parse(savedMessages) : {};
  });
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('vidyalink_notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
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

  useEffect(() => {
    localStorage.setItem('vidyalink_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('vidyalink_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      const savedMessages = localStorage.getItem('vidyalink_messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      const savedNotifications = localStorage.getItem('vidyalink_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

  const handleSendMessage = (courseId, message) => {
    setMessages(prev => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), message]
    }));

    const newNotification = {
      id: Date.now(),
      courseId,
      senderId: message.sender,
      recipientId: message.recipient,
      message: message.text,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleClearNotifications = (courseIdToClear, studentIdToClear) => {
    setNotifications(prev =>
      prev.map(n =>
        n.courseId === courseIdToClear &&
        n.recipientId === currentUser.username &&
        n.senderId === studentIdToClear
          ? { ...n, read: true }
          : n
      )
    );
  };
  
  const handleClearAllNotifications = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.recipientId === currentUser.username ? { ...n, read: true } : n
      )
    );
  };


  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} notifications={notifications.filter(n => n.recipientId === currentUser?.username && !n.read)} currentUser={currentUser} courses={courses} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route 
            path="/login" 
            element={!isLoggedIn ? <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} users={users} /> : <Navigate to="/learn" />} 
          />
          
          <Route path="/learn" element={isLoggedIn ? <LearnPage courses={courses} currentUser={currentUser} /> : <Navigate to="/login" />} />
          
          <Route 
            path="/course/:id" 
            element={isLoggedIn ? <CourseDetailPage courses={courses} onEnroll={handleEnroll} enrolledCourses={enrolledCourses} onSendMessage={handleSendMessage} messages={messages} currentUser={currentUser} onClearNotifications={handleClearNotifications}/> : <Navigate to="/login" />} 
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
            element={isLoggedIn ? <ProfilePage user={currentUser} onLogout={handleLogout} courses={courses} onDeleteCourse={handleDeleteCourse} enrolledCourses={enrolledCourses} onUnenroll={handleUnenroll} notifications={notifications.filter(n => n.recipientId === currentUser?.username && !n.read)} onClearAllNotifications={handleClearAllNotifications} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/tutor-chat/:courseId"
            element={isLoggedIn ? <TutorChatPage messages={messages} onSendMessage={handleSendMessage} currentUser={currentUser} courses={courses} onClearNotifications={handleClearNotifications} notifications={notifications} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;