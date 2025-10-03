import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { tutorId } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, sender: tutorId, text: 'Hello! How can I help you today?' },
    { id: 2, sender: 'student', text: 'I have a question about the first module.' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: 'student',
      text: newMessage,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="page-content chat-page">
      <h2>Chat with Tutor (PRN: {tutorId})</h2>
      <div className="chat-box">
        {messages.map(message => (
          <div key={message.id} className={`chat-message ${message.sender === 'student' ? 'student' : 'tutor'}`}>
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
  );
};

export default ChatPage;