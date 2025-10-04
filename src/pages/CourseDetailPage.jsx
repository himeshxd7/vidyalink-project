import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import StudentChatModal from './StudentChatModal';

const Module = ({ item, isEnrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="syllabus-item">
      <div className="syllabus-header" onClick={() => setIsOpen(!isOpen)}>
        <strong>Module {item.module}: {item.title}</strong>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      {isOpen && (
        <div className="syllabus-content">
          <p>{item.content}</p>
          {isEnrolled && item.materials && item.materials.length > 0 && (
            <div className="module-materials-display">
              <h4>Module Materials:</h4>
              {item.materials.map((material, index) => (
                <div key={index} className="material-display-item">
                  <a href={material.url} target="_blank" rel="noopener noreferrer">{material.title}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const CourseDetailPage = ({ courses, onEnroll, enrolledCourses, onSendMessage, messages, currentUser, onClearNotifications }) => {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  const [showQr, setShowQr] = useState(false);
  const [showEnrolledPopup, setShowEnrolledPopup] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useEffect(() => {
    if (isChatOpen) {
      onClearNotifications(id, course.tutorId);
    }
  }, [isChatOpen, id, course, onClearNotifications]);


  if (!course) {
    return (
      <div className="page-content">
        <h2>Course not found!</h2>
        <NavLink to="/learn">Back to Courses</NavLink>
      </div>
    );
  }

  const { details = {}, tutorContact = {} } = course;
  const isEnrolled = enrolledCourses.some(c => c.id === course.id);
  const isTutor = currentUser?.username === course.tutorId;


  const handleEnroll = () => {
    if (course.price > 0) {
      setShowQr(true);
    } else {
      onEnroll(course);
      setShowEnrolledPopup(true);
      setTimeout(() => setShowEnrolledPopup(false), 3000);
    }
  };

  const handlePaymentConfirmation = () => {
    const confirmed = window.confirm("Please confirm that you have completed the payment.");
    if (confirmed) {
      setShowQr(false);
      onEnroll(course);
      setShowEnrolledPopup(true);
      setTimeout(() => setShowEnrolledPopup(false), 3000);
    }
  };

  const handleChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="page-content course-detail-page">
      {showEnrolledPopup && (
        <div className="enroll-popup">
          <p>Successfully Enrolled!</p>
        </div>
      )}
      {isChatOpen && (
        <StudentChatModal
          tutorId={course.tutorId}
          courseId={course.id}
          messages={messages[course.id] || []}
          onSendMessage={onSendMessage}
          onClose={() => setIsChatOpen(false)}
          currentUser={currentUser}
        />
      )}
      {showQr && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <h3>Scan to Pay</h3>
            <img src={course.qrCodeUrl} alt="UPI QR Code" />
            <p>After paying, please click the button below to confirm.</p>
            <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
            <button onClick={() => setShowQr(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="course-detail-header">
        <h1>{course.title}</h1>
        <p className="tutor-info">Taught by Student Tutor (PRN: {course.tutorId})</p>
        <div className="course-meta">
          <span className="course-price-detail">{course.price > 0 ? `₹${course.price}` : 'Free'}</span>
          <span className={`course-mode-detail ${course.mode.toLowerCase()}`}>{course.mode}</span>
        </div>

        {isTutor ? (
            <NavLink to={`/tutor/${course.id}`} className="action-btn primary" style={{marginTop: '1rem'}}>
              <i className="fas fa-edit"></i> Manage Course
            </NavLink>
          ) : isEnrolled ? (
            <div className="enrolled-actions">
              <button className="action-btn success" disabled><i className="fas fa-check"></i> Enrolled</button>
              <button className="action-btn primary" onClick={handleChat}><i className="fas fa-comments"></i> Chat with Tutor</button>
            </div>
          ) : (
            <button className="action-btn danger" onClick={handleEnroll}>
              {course.price > 0 ? `Buy Now for ₹${course.price}` : 'Enroll for Free'}
            </button>
        )}
      </div>

      <div className="course-detail-grid">
        <div className="main-content">
          {details.whatYouWillLearn && (
            <div className="detail-section learn-section">
              <h2>What you'll learn</h2>
              <ul>
                {details.whatYouWillLearn.map((item, index) => (
                  <li key={index}>✓ {item}</li>
                ))}
              </ul>
            </div>
          )}

          {details.syllabus && (
            <div className="detail-section syllabus-section">
              <h2>Course Syllabus</h2>
              {details.syllabus.map((item) => (
                <Module key={item.module} item={item} isEnrolled={isEnrolled} />
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-content">
          {isEnrolled && (
            <div className="detail-section sidebar-card">
              <h3>Tutor Contact</h3>
              <p><strong>Name:</strong> {tutorContact.name}</p>
              <p><strong>Email:</strong> {tutorContact.email}</p>
              <p><strong>Phone/WhatsApp:</strong> {tutorContact.phone}</p>
            </div>
          )}

          {details.requirements && (
            <div className="detail-section sidebar-card">
              <h3>Requirements</h3>
              <ul>
                {details.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {details.targetAudience && (
            <div className="detail-section sidebar-card">
              <h3>Who this course is for</h3>
              <p>{details.targetAudience}</p>
            </div>
          )}
        </div>
      </div>

      <NavLink to="/learn" className="back-link">← Back to All Courses</NavLink>
    </div>
  );
};

export default CourseDetailPage;