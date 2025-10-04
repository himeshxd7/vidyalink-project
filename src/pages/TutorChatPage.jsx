import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TutorChatPage = ({ messages, onSendMessage, currentUser, courses, onClearNotifications, notifications }) => {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === courseId);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (courseId && selectedStudent) {
      onClearNotifications(courseId, selectedStudent);
    }
  }, [courseId, selectedStudent, onClearNotifications, currentUser.username]);

  if (!course) {
    return <div className="page-content">Course not found.</div>;
  }

  const courseMessages = messages[courseId] || [];
  const students = [...new Set(courseMessages.map(m => m.sender).concat(courseMessages.map(m => m.recipient)))].filter(s => s !== currentUser.username);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedStudent) return;

    const message = {
      sender: currentUser.username,
      recipient: selectedStudent,
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
          {students.map(student => {
            const hasUnread = notifications.some(n => n.senderId === student && n.courseId === courseId && !n.read && n.recipientId === currentUser.username);
            return (
              <div
                key={student}
                className={`student-list-item ${selectedStudent === student ? 'selected' : ''}`}
                onClick={() => setSelectedStudent(student)}
              >
                {student}
                {hasUnread && <span className="new-message-badge">New</span>}
              </div>
            );
          })}
        </div>
        <div className="chat-area">
          {selectedStudent ? (
            <>
              <div className="chat-box">
                {courseMessages.filter(m => (m.sender === selectedStudent && m.recipient === currentUser.username) || (m.sender === currentUser.username && m.recipient === selectedStudent)).map((message, index) => (
                  <div key={index} className={`chat-message ${message.sender === currentUser.username ? 'sent' : 'received'}`}>
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