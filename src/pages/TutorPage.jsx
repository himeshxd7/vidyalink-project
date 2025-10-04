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
  const [isFree, setIsFree] = useState(false);
  const [mode, setMode] = useState('Offline');
  const [syllabus, setSyllabus] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [tutorContact, setTutorContact] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (isEditing) {
      const courseToEdit = courses.find(c => c.id === id);
      if (courseToEdit) {
        setTitle(courseToEdit.title);
        setDescription(courseToEdit.description);
        setSkills(courseToEdit.skills.join(', '));
        setPrice(courseToEdit.price);
        setIsFree(courseToEdit.price === 0);
        setMode(courseToEdit.mode);
        const syllabusWithMaterials = courseToEdit.details?.syllabus?.map(module => ({
          ...module,
          materials: module.materials || []
        })) || [];
        setSyllabus(syllabusWithMaterials);
        setQrCodeUrl(courseToEdit.qrCodeUrl || '');
        setTutorContact(courseToEdit.tutorContact || { name: '', email: '', phone: '' });
      }
    }
  }, [id, courses, isEditing]);

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
        type: data.resource_type,
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

  const handleQrCodeUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = async () => {
        if (image.width !== 619 || image.height !== 619) {
          alert('QR code image must be 619x619 pixels.');
          return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        try {
          const response = await fetch(url, { method: 'POST', body: formData });
          const data = await response.json();
          if (data.error) throw new Error(data.error.message);

          setQrCodeUrl(data.secure_url);

        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
          alert(`Error uploading file: ${error.message}`);
        } finally {
          setIsUploading(false);
        }
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQrCode = () => {
    setQrCodeUrl('');
  };

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

  const handleContactChange = (event) => {
    setTutorContact({
      ...tutorContact,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseDetails = {
        whatYouWillLearn: [],
        requirements: [],
        targetAudience: '',
        syllabus: syllabus,
    };

    if (isEditing) {
      const originalCourse = courses.find(c => c.id === id);
      const updatedCourse = {
        ...originalCourse, title, description,
        skills: skills.split(',').map(skill => skill.trim()),
        price: isFree ? 0 : Number(price),
        mode,
        details: courseDetails,
        qrCodeUrl,
        tutorContact,
      };
      onUpdateCourse(updatedCourse);
    } else {
      const newCourse = {
        id: `course${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        title, tutorId: currentUser.username,
        skills: skills.split(',').map(skill => skill.trim()),
        description, mode,
        price: isFree ? 0 : Number(price),
        details: courseDetails,
        qrCodeUrl,
        tutorContact,
      };
      onAddCourse(newCourse);
    }
    navigate('/learn');
  };

  return (
    <div className="page-content">
      <form onSubmit={handleSubmit} className="tutor-form">
        <h1>{isEditing ? 'Edit Your Course' : 'Publish Your Course'}</h1>

        <div className="form-section">
          <h2>Course Information</h2>
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
        </div>

        <div className="form-section">
            <h2>Pricing & Mode</h2>
            <div className="form-group">
              <label>Course Fee</label>
              <div className="fee-toggle">
                <span>Paid</span>
                <label className="fee-toggle-switch">
                  <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} />
                  <span className="fee-toggle-slider"></span>
                </label>
                <span>Free</span>
              </div>
            </div>

            {!isFree && (
              <>
                <div className="form-group">
                  <label htmlFor="price">Price (₹)</label>
                  <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="qrCode">Upload UPI QR Code</label>
                  <p className="qr-size-note">QR code image should be a square of 619x619 pixels.</p>
                  <label htmlFor="qrCode" className="custom-file-input">Choose File</label>
                  <input type="file" id="qrCode" onChange={handleQrCodeUpload} accept="image/*" />
                  {qrCodeUrl && (
                    <div className="qr-code-preview">
                      <img src={qrCodeUrl} alt="QR Code" />
                      <button type="button" onClick={handleRemoveQrCode} className="remove-qr-btn">Remove QR Code</button>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="mode">Course Mode</label>
              <div className="custom-select-wrapper">
                <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="Offline">Offline (In-person)</option>
                  <option value="Online">Online (Materials provided)</option>
                </select>
              </div>
            </div>
        </div>

        <div className="form-section">
          <h2>Tutor Contact Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Your Full Name" value={tutorContact.name} onChange={handleContactChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Your Email" value={tutorContact.email} onChange={handleContactChange} required />
          </div>
          <div className="form-group">
            <label>Phone/WhatsApp</label>
            <input type="text" name="phone" placeholder="Your Phone/WhatsApp" value={tutorContact.phone} onChange={handleContactChange} required />
          </div>
        </div>

        <div className="form-section">
          <h2>Course Content & Modules</h2>
          {syllabus.map((item, moduleIndex) => (
              <div key={moduleIndex} className="syllabus-input-group">
                <input type="text" name="title" placeholder={`Module ${moduleIndex + 1} Title`} value={item.title} onChange={e => handleSyllabusChange(moduleIndex, e)} required />
                <textarea name="content" rows="3" placeholder="Module description and content..." value={item.content} onChange={e => handleSyllabusChange(moduleIndex, e)} required></textarea>
                
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
                            <>
                              <label htmlFor={`file-upload-${moduleIndex}`} className="custom-file-input">Add Material</label>
                              <input
                                  id={`file-upload-${moduleIndex}`}
                                  type="file"
                                  onChange={e => handleFileSelect(moduleIndex, e)}
                                  disabled={isUploading}
                                  accept="image/*,video/*"
                              />
                            </>
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