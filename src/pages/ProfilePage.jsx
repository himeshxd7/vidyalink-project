import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const ProfilePage = ({ user, onLogout, courses }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const myCourses = courses.filter(course => course.tutorId === user?.username);

  return (
    <div className="page-content">
      <h1>Your Profile</h1>
      <div className="profile-details">
        <p><strong>Username (PRN):</strong> {user?.username}</p>
      </div>

      <div className="published-courses">
        <h2>Your Published Courses</h2>
        {myCourses.length > 0 ? (
          <div className="course-grid">
            {myCourses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p className="course-tutor">Tutor PRN: {course.tutorId}</p>
                <div className="course-details">
                  <span className="course-price">₹{course.price}</span>
                  <span className={`course-mode ${course.mode.toLowerCase()}`}>{course.mode}</span>
                </div>
                {/* Updated NavLink to point to /tutor/:id */}
                <NavLink to={`/tutor/${course.id}`} className="edit-course-link" style={{ marginTop: '1rem', display: 'inline-block', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  Edit Course
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not published any courses yet.</p>
        )}
      </div>

      <div className="enrolled-courses" style={{ marginTop: '2rem' }}>
        <h3>Courses Enrolled</h3>
        <p>This feature is coming soon!</p>
      </div>

      <button onClick={handleLogoutClick} className="logout-btn" style={{ marginTop: '2rem' }}>
        Log Out
      </button>
    </div>
  );
};

export default ProfilePage;