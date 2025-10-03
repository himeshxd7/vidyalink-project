import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TutorPage = ({ onAddCourse, onUpdateCourse, currentUser, courses }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isUploading, setIsUploading] = useState(false);

  // --- Your Cloudinary Configuration ---
  const CLOUD_NAME = "dpcslds74";
  const UPLOAD_PRESET = "vidyalink_preset";

  // State variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState('Offline');
  // Syllabus is now the core for course content, containing its own materials
  const [syllabus, setSyllabus] = useState([]);

  useEffect(() => {
    if (isEditing) {
      const courseToEdit = courses.find(c => c.id === id);
      if (courseToEdit) {
        setTitle(courseToEdit.title);
        setDescription(courseToEdit.description);
        setSkills(courseToEdit.skills.join(', '));
        setPrice(courseToEdit.price);
        setMode(courseToEdit.mode);
        // Ensure syllabus exists and has a materials array for each module
        const syllabusWithMaterials = courseToEdit.details?.syllabus?.map(module => ({
          ...module,
          materials: module.materials || []
        })) || [];
        setSyllabus(syllabusWithMaterials);
      }
    }
  }, [id, courses, isEditing]);

  // --- Main upload handler ---
  const handleFileSelect = async (moduleIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

    try {
      const response = await fetch(url, { method: 'POST', body: formData });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const newMaterial = {
        type: data.resource_type, // 'image' or 'video'
        title: data.original_filename || file.name,
        url: data.secure_url,
        public_id: data.public_id,
      };
      
      const newSyllabus = [...syllabus];
      newSyllabus[moduleIndex].materials.push(newMaterial);
      setSyllabus(newSyllabus);

    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Syllabus and Material Management ---
  const handleSyllabusChange = (index, event) => {
    const values = [...syllabus];
    values[index][event.target.name] = event.target.value;
    setSyllabus(values);
  };

  const handleAddSyllabus = () => {
    setSyllabus([...syllabus, { module: syllabus.length + 1, title: '', content: '', materials: [] }]);
  };

  const handleRemoveSyllabus = (index) => {
    const values = [...syllabus];
    values.splice(index, 1);
    setSyllabus(values);
  };
  
  const handleRemoveMaterial = (moduleIndex, materialIndex) => {
    const newSyllabus = [...syllabus];
    newSyllabus[moduleIndex].materials.splice(materialIndex, 1);
    setSyllabus(newSyllabus);
  };


  // --- Form Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const courseDetails = {
        whatYouWillLearn: [], // Add other details if needed in the future
        requirements: [],
        targetAudience: '',
        syllabus: syllabus, // The syllabus now contains all content
    };

    if (isEditing) {
      const originalCourse = courses.find(c => c.id === id);
      const updatedCourse = {
        ...originalCourse, title, description,
        skills: skills.split(',').map(skill => skill.trim()),
        price: Number(price), mode,
        details: courseDetails,
      };
      onUpdateCourse(updatedCourse);
    } else {
      const newCourse = {
        id: `course${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        title, tutorId: currentUser.username,
        skills: skills.split(',').map(skill => skill.trim()),
        description, mode,
        price: Number(price),
        details: courseDetails,
      };
      onAddCourse(newCourse);
    }
    navigate('/learn');
  };

  return (
    <div className="page-content">
      <h1>{isEditing ? 'Edit Your Course' : 'Publish Your Course'}</h1>
      <form onSubmit={handleSubmit} className="tutor-form">
        {/* --- Basic Course Info --- */}
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input type="text" id="skills" placeholder="e.g., python, coding" value={skills} onChange={(e) => setSkills(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          {/* THE FIX: Added min="0" to prevent negative prices */}
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
        </div>
        <div className="form-group">
          <label htmlFor="mode">Course Mode</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="Offline">Offline (In-person)</option>
            <option value="Online">Online (Materials provided)</option>
          </select>
        </div>

        {/* --- Course Content Section (Modules & Materials) --- */}
        <div className="form-group">
            <label>Course Content & Modules</label>
            {syllabus.map((item, moduleIndex) => (
              <div key={moduleIndex} className="syllabus-input-group">
                <input type="text" name="title" placeholder={`Module ${moduleIndex + 1} Title`} value={item.title} onChange={e => handleSyllabusChange(moduleIndex, e)} required />
                <textarea name="content" rows="3" placeholder="Module description and content..." value={item.content} onChange={e => handleSyllabusChange(moduleIndex, e)} required></textarea>
                
                {/* --- Module-Specific Materials --- */}
                <div className="module-materials">
                    <label style={{fontSize: '0.9rem', fontWeight: '500'}}>Module Materials</label>
                    {item.materials.map((material, materialIndex) => (
                        <div key={materialIndex} className="material-item">
                            <span>{material.type === 'image' ? '🖼️' : '🎥'} {material.title}</span>
                            <button type="button" onClick={() => handleRemoveMaterial(moduleIndex, materialIndex)} className="remove-btn-small">Remove</button>
                        </div>
                    ))}
                    <div className="file-input-wrapper">
                        {isUploading ? <p>Uploading...</p> :
                            <input
                                type="file"
                                onChange={e => handleFileSelect(moduleIndex, e)}
                                disabled={isUploading}
                                accept="image/*,video/*" // THE FIX: No more PDF
                            />
                        }
                    </div>
                </div>
                <button type="button" onClick={() => handleRemoveSyllabus(moduleIndex)} className="remove-btn">Remove Module</button>
              </div>
            ))}
            <button type="button" onClick={handleAddSyllabus}>Add Module</button>
          </div>

        <button type="submit" className="publish-btn" disabled={isUploading}>
          {isUploading ? 'Uploading...' : isEditing ? 'Update Course' : 'Publish Course'}
        </button>
      </form>
    </div>
  );
};

export default TutorPage;