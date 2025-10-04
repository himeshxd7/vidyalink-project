import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const ProfilePage = ({ user, onLogout, courses, onDeleteCourse, enrolledCourses, onUnenroll }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const handleCourseClick = (courseId) => {
    navigate(`/tutor-chat/${courseId}`);
  };

  return (
    <div className="page-content">
      <h1>Your Profile</h1>
      <div className="profile-details">
        <p><strong>Username (PRN):</strong> {user?.username}</p>
      </div>

      <div className="published-courses">
        <h2>Your Published Courses</h2>
        {courses.filter(c => c.tutorId === user.username).length > 0 ? (
          <div className="course-grid">
            {courses.filter(c => c.tutorId === user.username).map(course => (
              <div key={course.id} className="course-card" onClick={() => handleCourseClick(course.id)}>
                <h3>{course.title}</h3>
                <p className="course-tutor">Tutor PRN: {course.tutorId}</p>
                <div className="course-details">
                  <span className="course-price">₹{course.price}</span>
                  <span className={`course-mode ${course.mode.toLowerCase()}`}>{course.mode}</span>
                </div>
                <button className="manage-course-btn">Manage Course & Chats</button>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not published any courses yet.</p>
        )}
      </div>

      <div className="enrolled-courses" style={{ marginTop: '2rem' }}>
        <h2>Courses Enrolled</h2>
        {enrolledCourses.length > 0 ? (
          <div className="course-grid">
            {enrolledCourses.map(course => (
              <div key={course.id} className="course-card-link">
                <NavLink to={`/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="course-card">
                    <h3>{course.title}</h3>
                    <p className="course-tutor">Tutor PRN: {course.tutorId}</p>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not enrolled in any courses yet.</p>
        )}
      </div>

      <button onClick={handleLogoutClick} className="logout-btn" style={{ marginTop: '2rem' }}>
        Log Out
      </button>
    </div>
  );
};

export default ProfilePage;