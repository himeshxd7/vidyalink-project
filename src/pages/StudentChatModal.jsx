import React, { useState } from 'react';

const StudentChatModal = ({ tutorId, courseId, messages, onSendMessage, onClose, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      sender: currentUser.username,
      recipient: tutorId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    onSendMessage(courseId, message);
    setNewMessage('');
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-modal-header">
          <h3>Chat with Tutor (PRN: {tutorId})</h3>
          <button onClick={onClose} className="close-chat-btn">×</button>
        </div>
        <div className="chat-box">
          {messages.map((message, index) => (
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
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default StudentChatModal;