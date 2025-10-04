import React, { useState, useEffect, useRef } from 'react';

const StudentChatModal = ({ tutorId, courseId, messages, onSendMessage, onClose, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      sender: currentUser.username,
      recipient: tutorId,
      text: newMessage,
    };
    onSendMessage(courseId, message);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-modal-header">
          <h3>Chat with Tutor (PRN: {tutorId})</h3>
          <button onClick={onClose} className="close-chat-btn">×</button>
        </div>
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender === currentUser.username ? 'sent' : 'received'}`}>
              <p>{message.text}</p>
              <span className="chat-timestamp">{formatTimestamp(message.timestamp)}</span>
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