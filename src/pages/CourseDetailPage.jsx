import React, { useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';

const CourseDetailPage = ({ courses, onEnroll, enrolledCourses }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === id);
  const [showQr, setShowQr] = useState(false);
  const [showEnrolledPopup, setShowEnrolledPopup] = useState(false);

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
    navigate(`/chat/${course.tutorId}`);
  };

  return (
    <div className="page-content course-detail-page">
      {showEnrolledPopup && (
        <div className="enroll-popup">
          <p>Successfully Enrolled!</p>
        </div>
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
        {isEnrolled ? (
          <div className="enrolled-actions">
            <button className="enroll-btn enrolled" disabled>Enrolled</button>
            <button className="chat-btn" onClick={handleChat}>Chat with Tutor</button>
          </div>
        ) : (
          <button className="enroll-btn" onClick={handleEnroll}>
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
                <div key={item.module} className="syllabus-item">
                  <strong>Module {item.module}: {item.title}</strong>
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