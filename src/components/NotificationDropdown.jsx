import React from 'react';
import { NavLink } from 'react-router-dom';

const NotificationDropdown = ({ notifications, courses, currentUser }) => {
  return (
    <div className="notification-dropdown">
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <p>
              <strong>
                New message in {courses.find(c => c.id === notification.courseId)?.title}
              </strong>
              <br />
              <em>"{notification.message}"</em>
            </p>
            <NavLink
              to={
                currentUser.username === courses.find(c => c.id === notification.courseId)?.tutorId
                  ? `/tutor-chat/${notification.courseId}`
                  : `/course/${notification.courseId}`
              }
              className="view-chat-btn"
            >
              View Chat
            </NavLink>
          </div>
        ))
      ) : (
        <div className="notification-item">
          <p>No new notifications.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;