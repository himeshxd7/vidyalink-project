import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TutorPage = ({ onAddCourse, onUpdateCourse, currentUser, courses }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState('Offline');
  const [materials, setMaterials] = useState([]);
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
        setMaterials(courseToEdit.details?.materials || []);
        setSyllabus(courseToEdit.details?.syllabus || []);
      }
    }
  }, [id, courses, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      const originalCourse = courses.find(c => c.id === id);
      const updatedCourse = {
        ...originalCourse, // Start with the original course data
        // Overwrite the properties that were edited in the form
        title,
        description,
        skills: skills.split(',').map(skill => skill.trim()),
        price: Number(price),
        mode,
        // *** THE FIX: Deep merge the 'details' object ***
        details: {
          ...originalCourse.details, // Keep existing details (like requirements, etc.)
          materials: mode === 'Online' ? materials.filter(m => m.title.trim() !== '') : originalCourse.details.materials, // Update materials only if in online mode
          syllabus: mode === 'Offline' ? syllabus.filter(s => s.title.trim() !== '') : originalCourse.details.syllabus, // Update syllabus only if in offline mode
        }
      };
      onUpdateCourse(updatedCourse);
    } else {
      // Logic for creating a new course (remains the same)
      const newCourse = {
        id: `course${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        title,
        tutorId: currentUser.username,
        skills: skills.split(',').map(skill => skill.trim()),
        description,
        mode,
        price: Number(price),
        details: {
          materials: mode === 'Online' ? materials.filter(m => m.title.trim() !== '') : [],
          syllabus: mode === 'Offline' ? syllabus.filter(s => s.title.trim() !== '') : [],
        }
      };
      onAddCourse(newCourse);
    }

    navigate('/learn'); // Navigate to the learn page after submit
  };
  
  // Handlers for materials and syllabus (no changes here)
  const handleMaterialTypeChange = (index, event) => {
    const values = [...materials];
    values[index].type = event.target.value;
    setMaterials(values);
  };

  const handleFileSelect = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const values = [...materials];
      values[index].title = file.name;
      setMaterials(values);
    }
  };
  
  const handleAddMaterial = () => {
    setMaterials([...materials, { type: 'pdf', title: '' }]);
  };

  const handleRemoveMaterial = (index) => {
    const values = [...materials];
    values.splice(index, 1);
    setMaterials(values);
  };
  
  const handleSyllabusChange = (index, event) => {
    const values = [...syllabus];
    values[index][event.target.name] = event.target.value;
    setSyllabus(values);
  };

  const handleAddSyllabus = () => {
    setSyllabus([...syllabus, { module: syllabus.length + 1, title: '', content: '' }]);
  };

  const handleRemoveSyllabus = (index) => {
    const values = [...syllabus];
    values.splice(index, 1);
    setSyllabus(values);
  };

  return (
    <div className="page-content">
      <h1>{isEditing ? 'Edit Your Course' : 'Publish Your Course'}</h1>
      <form onSubmit={handleSubmit} className="tutor-form">
        {/* All form fields remain the same */}
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
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="mode">Course Mode</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="Offline">Offline (In-person)</option>
            <option value="Online">Online (Materials provided)</option>
          </select>
        </div>

        {mode === 'Online' && (
          <div className="form-group">
            <label>Course Materials</label>
            {materials.map((material, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <select name="type" value={material.type} onChange={e => handleMaterialTypeChange(index, e)}>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
                <div style={{ flex: 1, border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }}>
                  <input
                    type="file"
                    onChange={e => handleFileSelect(index, e)}
                    accept={
                      material.type === 'pdf' ? '.pdf' :
                      material.type === 'video' ? 'video/*' :
                      'image/*'
                    }
                  />
                  {material.title && <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>Selected: {material.title}</p>}
                </div>
                <button type="button" onClick={() => handleRemoveMaterial(index)} className="remove-btn">Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddMaterial}>Add Material</button>
            <p style={{fontSize: '0.8rem', color: 'var(--secondary-color)', marginTop: '10px'}}>
              <em>Note: This is a frontend demonstration. In a real product, this would upload the file to a secure server.</em>
            </p>
          </div>
        )}
        
        {mode === 'Offline' && (
          <div className="form-group">
            <label>Syllabus</label>
            {syllabus.map((item, index) => (
              <div key={index} className="syllabus-input-group">
                <input type="text" name="title" placeholder={`Module ${index + 1} Title`} value={item.title} onChange={e => handleSyllabusChange(index, e)} style={{ marginBottom: '5px' }} />
                <textarea name="content" rows="2" placeholder="Module Content" value={item.content} onChange={e => handleSyllabusChange(index, e)}></textarea>
                <button type="button" onClick={() => handleRemoveSyllabus(index)} className="remove-btn">Remove Module</button>
              </div>
            ))}
            <button type="button" onClick={handleAddSyllabus}>Add Module</button>
          </div>
        )}

        <button type="submit" className="publish-btn">
          {isEditing ? 'Update Course' : 'Publish Course'}
        </button>
      </form>
    </div>
  );
};

export default TutorPage;