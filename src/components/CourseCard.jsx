import React from 'react';
import { NavLink } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <NavLink to={`/course/${course.id}`} className="course-card-link">
      <div className="course-card">
        <h3>{course.title}</h3>
        <p className="course-tutor">Tutor PRN: {course.tutorId}</p>
        <p className="course-description">{course.description}</p>
        <div className="course-details">
          <span className="course-price">{course.price > 0 ? `₹${course.price}` : 'Free'}</span>
          <span className={`course-mode ${course.mode.toLowerCase()}`}>{course.mode}</span>
        </div>
        <div className="course-skills">
          {course.skills.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </NavLink>
  );
};

export default CourseCard;