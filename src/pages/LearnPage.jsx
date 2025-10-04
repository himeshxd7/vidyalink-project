import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';

const LearnPage = ({ courses, currentUser }) => { 
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses
    .filter(course => course.tutorId !== currentUser.username) // Exclude user's own courses
    .filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skills.some(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

  return (
    <div className="page-content">
      <h1>Discover Courses</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a skill or course title..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p>No courses found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default LearnPage;