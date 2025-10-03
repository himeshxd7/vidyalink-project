import React from 'react';
import { useParams, NavLink } from 'react-router-dom';

const CourseDetailPage = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="page-content">
        <h2>Course not found!</h2>
        <NavLink to="/learn">Back to Courses</NavLink>
      </div>
    );
  }

  // Use optional chaining for safety in case 'details' is missing
  const { details = {} } = course;

  return (
    <div className="page-content course-detail-page">
      <div className="course-detail-header">
        <h1>{course.title}</h1>
        <p className="tutor-info">Taught by Student Tutor (PRN: {course.tutorId})</p>
        <div className="course-meta">
          <span className="course-price-detail">₹{course.price}</span>
          <span className={`course-mode-detail ${course.mode.toLowerCase()}`}>{course.mode}</span>
        </div>
      </div>

      <div className="course-detail-grid">
        <div className="main-content">
          {/* What You'll Learn Section */}
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

          {/* Syllabus Section */}
          {details.syllabus && (
            <div className="detail-section syllabus-section">
              <h2>Course Syllabus</h2>
              {details.syllabus.map((item) => (
                <div key={item.module} className="syllabus-item">
                  <strong>Module {item.module}: {item.title}</strong>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-content">
          {/* Requirements Section */}
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

          {/* Target Audience Section */}
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