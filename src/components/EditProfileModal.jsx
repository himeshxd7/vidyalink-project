import React, { useState, useEffect } from 'react';

const EditProfileModal = ({ user, onUpdateUser, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
    year: '',
    semester: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        course: user.course || '',
        year: user.year || '',
        semester: user.semester || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
    onClose();
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Your Profile</h2>
          <button onClick={onClose} className="close-modal-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone/WhatsApp</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="course">Course (e.g., BTECH CSE)</label>
            <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <input type="number" id="semester" name="semester" value={formData.semester} onChange={handleChange} required />
          </div>
          <button type="submit" className="publish-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;