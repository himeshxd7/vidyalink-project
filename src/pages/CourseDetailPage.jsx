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

  const { details = {} } = course;

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      default: return '🔗';
    }
  };

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
          <div className="detail-section">
            <h2>Course Description</h2>
            <p>{course.description}</p>
          </div>

          {details.whatYouWillLearn && details.whatYouWillLearn.length > 0 && (
            <div className="detail-section learn-section">
              <h2>What you'll learn</h2>
              <ul>
                {details.whatYouWillLearn.map((item, index) => (
                  <li key={index}>✓ {item}</li>
                ))}
              </ul>
            </div>
          )}

          {details.syllabus && details.syllabus.length > 0 && (
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
          
          {/* Section to display uploaded materials */}
          {details.materials && details.materials.length > 0 && (
              <div className="detail-section materials-section">
                  <h2>Course Materials</h2>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {details.materials.map((item, index) => (
                          <li key={index} style={{ marginBottom: '10px' }}>
                            <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>{getFileIcon(item.type)}</span>
                            {item.title}
                          </li>
                      ))}
                  </ul>
              </div>
          )}
        </div>

        <div className="sidebar-content">
          {details.requirements && details.requirements.length > 0 && (
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