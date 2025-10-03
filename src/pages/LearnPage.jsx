import React, { useState } from 'react';
// We no longer import the static JSON file here
// import courses from '../data/courses.json'; 
import CourseCard from '../components/CourseCard';

// The courses array is now passed in as a prop
const LearnPage = ({ courses }) => { 
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.skills.some(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

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