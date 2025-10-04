import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';

const ProfilePage = ({ user, onLogout, courses, onDeleteCourse, enrolledCourses, onUnenroll, notifications, onClearAllNotifications, onUpdateUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('published');
  const [enrolledTab, setEnrolledTab] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onUpdateUser={onUpdateUser}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <div className="profile-header">
        <img src={user?.pfp || 'https://i.pravatar.cc/150'} alt="Profile" className="profile-pic-large" />
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p><strong>PRN:</strong> {user?.username}</p>
          <p><strong>Course:</strong> {user?.course}</p>
          <p><strong>Year/Semester:</strong> {user?.year}/{user?.semester}</p>
          <p><strong>Age:</strong> {user?.age}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
        </div>
        <div className="profile-actions">
          <button onClick={() => setIsEditModalOpen(true)} className="action-btn secondary">
            <i className="fas fa-user-edit"></i> Edit Profile
          </button>
          <button onClick={handleLogoutClick} className="action-btn danger">
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>
        </div>
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
                    <NavLink to={`/tutor/${course.id}`} className="action-btn secondary">
                      <i className="fas fa-edit"></i> Edit
                    </NavLink>
                    <NavLink to={`/tutor-chat/${course.id}`} className="action-btn primary">
                      <i className="fas fa-envelope"></i> Messages
                    </NavLink>
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
            <button onClick={onClearAllNotifications} className="clear-notifications-btn">Clear All Notifications</button>
            <div className="notification-list">
              {notifications.map(notification => {
                const course = courses.find(c => c.id === notification.courseId);
                const isTutor = user.username === course?.tutorId;
                const chatLink = isTutor ? `/tutor-chat/${notification.courseId}` : `/course/${notification.courseId}`;

                return (
                  <div key={notification.id} className="notification-item">
                    <p>
                      <strong>New message in {course?.title} from {notification.senderId}:</strong> {notification.message}
                    </p>
                    <NavLink to={chatLink} className="view-chat-btn">
                      View Chat
                    </NavLink>
                  </div>
                );
              })}
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