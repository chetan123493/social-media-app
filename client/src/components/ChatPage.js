import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { userId } = useParams(); // The ID of the user you're chatting with
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all messages with the specific user
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  // Send a new message
  const sendMessage = async () => {
    if (!message.trim()) return; // Avoid sending empty messages

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: userId,     // Correctly use userId from route
          content: message,       // Use the message state
        }),
      });

      const data = await res.json();
      console.log('Message sent:', data);
      
      // Refresh the message list and clear input
      setMessages((prev) => [...prev, data]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="chat-page">
      <h3>Chat with {userId}</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid gray', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender?.username || 'Unknown'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{ width: '80%', padding: '5px' }}
        />
        <button onClick={sendMessage} style={{ padding: '5px 10px' }}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
