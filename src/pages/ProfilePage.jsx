import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const ProfilePage = ({ user, onLogout, courses, onDeleteCourse, enrolledCourses, onUnenroll, notifications, onClearNotifications }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('published');
  const [enrolledTab, setEnrolledTab] = useState('all');

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const publishedCourses = courses.filter(c => c.tutorId === user.username);
  const freeEnrolled = enrolledCourses.filter(c => c.price === 0);
  const paidEnrolled = enrolledCourses.filter(c => c.price > 0);

  const filteredEnrolledCourses = () => {
    switch (enrolledTab) {
      case 'free':
        return freeEnrolled;
      case 'paid':
        return paidEnrolled;
      default:
        return enrolledCourses;
    }
  };

  return (
    <div className="page-content profile-page">
      <div className="profile-header">
        <img src={user?.pfp || 'https://i.pravatar.cc/150'} alt="Profile" className="profile-pic-large" />
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p><strong>PRN:</strong> {user?.username}</p>
          <p><strong>Course:</strong> {user?.course}</p>
          <p><strong>Year/Semester:</strong> {user?.year}/{user?.semester}</p>
          <p><strong>Age:</strong> {user?.age}</p>
        </div>
        <button onClick={handleLogoutClick} className="logout-btn">
          Log Out
        </button>
      </div>

      <div className="profile-tabs">
        <button className={activeTab === 'published' ? 'active' : ''} onClick={() => setActiveTab('published')}>Published Courses</button>
        <button className={activeTab === 'enrolled' ? 'active' : ''} onClick={() => setActiveTab('enrolled')}>Enrolled Courses</button>
      </div>

      {activeTab === 'published' && (
        <div className="tab-content">
          <h2>Your Published Courses</h2>
          {publishedCourses.length > 0 ? (
            <div className="course-grid">
              {publishedCourses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.title}</h3>
                  <p className="course-tutor">Tutor PRN: {course.tutorId}</p>
                  <div className="course-details">
                    <span className="course-price">₹{course.price}</span>
                    <span className={`course-mode ${course.mode.toLowerCase()}`}>{course.mode}</span>
                  </div>
                   <div className="tutor-actions">
                    <NavLink to={`/tutor/${course.id}`} className="manage-course-btn">Edit Course</NavLink>
                    <NavLink to={`/tutor-chat/${course.id}`} className="manage-course-btn">Messages</NavLink>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You have not published any courses yet.</p>
          )}
        </div>
      )}

      {activeTab === 'enrolled' && (
        <div className="tab-content">
          <h2>Courses Enrolled</h2>
          <div className="enrolled-tabs">
            <button className={enrolledTab === 'all' ? 'active' : ''} onClick={() => setEnrolledTab('all')}>All</button>
            <button className={enrolledTab === 'free' ? 'active' : ''} onClick={() => setEnrolledTab('free')}>Free</button>
            <button className={enrolledTab === 'paid' ? 'active' : ''} onClick={() => setEnrolledTab('paid')}>Paid</button>
          </div>
          {filteredEnrolledCourses().length > 0 ? (
            <div className="course-grid">
              {filteredEnrolledCourses().map(course => (
                <div key={course.id} className="course-card">
                    <NavLink to={`/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3>{course.title}</h3>
                      <p className="course-tutor">Tutor PRN: {course.tutorId}</p>
                    </NavLink>
                    <button onClick={() => onUnenroll(course.id)} className="unenroll-btn">Unenroll</button>
                </div>
              ))}
            </div>
          ) : (
            <p>You have not enrolled in any {enrolledTab !== 'all' ? enrolledTab : ''} courses yet.</p>
          )}
        </div>
      )}

      <div className="notifications-section" style={{ marginTop: '2rem' }}>
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <>
            <button onClick={() => onClearNotifications(user.username)} className="clear-notifications-btn">Clear All Notifications</button>
            <div className="notification-list">
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <p><strong>New message in {courses.find(c => c.id === notification.courseId)?.title} from {notification.tutorId === user.username ? notification.studentId : notification.tutorId}:</strong> {notification.message}</p>
                  <NavLink to={notification.tutorId === user.username ? `/tutor-chat/${notification.courseId}` : `/course/${notification.courseId}`} className="view-chat-btn">View Chat</NavLink>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;