import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TutorPage = ({ onAddCourse, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState('Offline'); // Default to Offline
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new course object
    const newCourse = {
      id: `course${Date.now()}`, // Simple unique ID
      title,
      tutorId: currentUser.username, // Use the logged-in user's PRN
      skills: skills.split(',').map(skill => skill.trim()), // Convert comma-separated string to an array
      description,
      mode,
      price: Number(price),
      dateCreated: new Date().toISOString().split('T')[0], // Get current date in YYYY-MM-DD format
    };

    // Pass the new course up to the App component
    onAddCourse(newCourse);

    // Navigate to the learn page to see the new course
    navigate('/learn');
  };

  return (
    <div className="page-content">
      <h1>Publish Your Course</h1>
      <form onSubmit={handleSubmit} className="tutor-form">
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            rows="4" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input 
            type="text" 
            id="skills" 
            placeholder="e.g., python, coding, data-science" 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input 
            type="number" 
            id="price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="mode">Course Mode</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="Offline">Offline (In-person)</option>
            <option value="Online">Online (Materials provided)</option>
          </select>
        </div>
        <button type="submit" className="publish-btn">Publish Course</button>
      </form>
    </div>
  );
};

export default TutorPage;