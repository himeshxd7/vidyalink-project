import React from 'react';
import { useParams, NavLink } from 'react-router-dom';

const CourseDetailPage = ({ courses }) => {
  const { id } = useParams(); // Gets the course ID from the URL
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="page-content">
        <h2>Course not found!</h2>
        <NavLink to="/learn">Back to Courses</NavLink>
      </div>
    );
  }

  return (
    <div className="page-content course-detail-page">
      <div className="course-detail-header">
        <h1>{course.title}</h1>
        <p className="tutor-info">Taught by PRN: {course.tutorId}</p>
      </div>

      <div className="course-detail-body">
        <div className="course-meta">
          <span className="course-price-detail">₹{course.price}</span>
          <span className={`course-mode-detail ${course.mode.toLowerCase()}`}>{course.mode}</span>
        </div>
        
        <h2>About this course</h2>
        <p className="course-description-full">{course.description}</p>

        <h2>Skills you will gain</h2>
        <div className="course-skills-detail">
          {course.skills.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>

        {course.mode === 'Online' && (
          <div className="course-materials">
            <h2>Course Materials</h2>
            <p>Registered users can access uploaded PDFs, videos, and other materials here.</p>
            {/* In a real app, you would list the materials here */}
          </div>
        )}
      </div>

      <NavLink to="/learn" className="back-link">← Back to All Courses</NavLink>
    </div>
  );
};

export default CourseDetailPage;