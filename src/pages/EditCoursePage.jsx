import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCoursePage = ({ courses, onUpdateCourse }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseToEdit = courses.find(c => c.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState('Offline');
  const [materials, setMaterials] = useState([]);
  const [syllabus, setSyllabus] = useState([]);

  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title);
      setDescription(courseToEdit.description);
      setSkills(courseToEdit.skills.join(', '));
      setPrice(courseToEdit.price);
      setMode(courseToEdit.mode);
      setMaterials(courseToEdit.details?.materials || []);
      setSyllabus(courseToEdit.details?.syllabus || []);
    }
  }, [courseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCourse = {
      ...courseToEdit,
      title,
      description,
      skills: skills.split(',').map(skill => skill.trim()),
      price: Number(price),
      mode,
      details: {
        materials: mode === 'Online' ? materials : [],
        syllabus: mode === 'Offline' ? syllabus : [],
      }
    };
    onUpdateCourse(updatedCourse);
    navigate('/profile');
  };

  if (!courseToEdit) {
    return <div>Course not found.</div>;
  }

  // Handlers for materials and syllabus (similar to TutorPage)
  const handleMaterialChange = (index, event) => {
    const values = [...materials];
    values[index][event.target.name] = event.target.value;
    setMaterials(values);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { type: 'pdf', title: '' }]);
  };

  const handleSyllabusChange = (index, event) => {
    const values = [...syllabus];
    values[index][event.target.name] = event.target.value;
    setSyllabus(values);
  };

  const handleAddSyllabus = () => {
    setSyllabus([...syllabus, { module: syllabus.length + 1, title: '', content: '' }]);
  };

  return (
    <div className="page-content">
      <h1>Edit Your Course</h1>
      <form onSubmit={handleSubmit} className="tutor-form">
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
          <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} required />
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
              <div key={index} className="material-input" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select name="type" value={material.type} onChange={e => handleMaterialChange(index, e)}>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
                <input type="text" name="title" placeholder="Material Title" value={material.title} onChange={e => handleMaterialChange(index, e)} required style={{ flex: 1 }} />
              </div>
            ))}
            <button type="button" onClick={handleAddMaterial}>Add Material</button>
          </div>
        )}

        {mode === 'Offline' && (
          <div className="form-group">
            <label>Syllabus</label>
            {syllabus.map((item, index) => (
              <div key={index} className="syllabus-input" style={{ marginBottom: '15px' }}>
                <input type="text" name="title" placeholder={`Module ${index + 1} Title`} value={item.title} onChange={e => handleSyllabusChange(index, e)} required style={{ marginBottom: '5px' }} />
                <textarea name="content" rows="2" placeholder="Module Content" value={item.content} onChange={e => handleSyllabusChange(index, e)} required></textarea>
              </div>
            ))}
            <button type="button" onClick={handleAddSyllabus}>Add Module</button>
          </div>
        )}

        <button type="submit" className="publish-btn" style={{ backgroundColor: '#007bff' }}>Update Course</button>
      </form>
    </div>
  );
};

export default EditCoursePage;