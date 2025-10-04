import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const TutorChatPage = ({ messages, onSendMessage, currentUser, courses }) => {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === courseId);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  if (!course) {
    return <div className="page-content">Course not found.</div>;
  }

  const courseMessages = messages[courseId] || [];
  const students = [...new Set(courseMessages.map(m => m.sender))].filter(s => s !== currentUser.username);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedStudent) return;

    const message = {
      sender: currentUser.username,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    onSendMessage(courseId, message);
    setNewMessage('');
  };

  return (
    <div className="page-content tutor-chat-page">
      <div className="chat-layout">
        <div className="student-list">
          <h3>Students in {course.title}</h3>
          {students.map(student => (
            <div 
              key={student} 
              className={`student-list-item ${selectedStudent === student ? 'selected' : ''}`}
              onClick={() => setSelectedStudent(student)}
            >
              {student}
            </div>
          ))}
        </div>
        <div className="chat-area">
          {selectedStudent ? (
            <>
              <div className="chat-box">
                {courseMessages.filter(m => m.sender === selectedStudent || m.sender === currentUser.username).map((message, index) => (
                  <div key={index} className={`chat-message ${message.sender === currentUser.username ? 'tutor' : 'student'}`}>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="chat-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Reply to ${selectedStudent}...`}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a student to view the chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorChatPage;