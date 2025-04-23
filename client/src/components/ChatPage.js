import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPaperPlane, FaHeart, FaSun, FaMoon } from 'react-icons/fa'; // Importing icons for theme toggle
import './ChatPage.css';
import { colors } from './colors'; // Assuming colors is an array of color hex values

const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState('');
  const [bgColor, setBgColor] = useState('#f5f5f5');
  const [favColor, setFavColor] = useState(null);
  const [isCycling, setIsCycling] = useState(true);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [showThemes, setShowThemes] = useState(false); // ✅ Add this state

  const currentUser = JSON.parse(localStorage.getItem('user'));

  let colorIndex = 0;

  const updateBackground = () => {
    if (!favColor && isCycling && !isRandomMode) {
      setBgColor(colors[colorIndex]);
      colorIndex = (colorIndex + 1) % colors.length;
    }
  };

  useEffect(() => {
    let interval;
    if (isRandomMode) {
      interval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setBgColor(randomColor);
      }, 10000);
    } else if (!favColor && isCycling) {
      interval = setInterval(updateBackground, 5000);
    }

    return () => clearInterval(interval);
  }, [favColor, isCycling, isRandomMode]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessages(res.data.messages);
        setOtherUser(res.data.otherUser.username);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [userId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/messages',
        { receiverId: userId, content: message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages((prevMessages) => [...prevMessages, res.data]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Remove the deleted message from the state
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  useEffect(() => {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const handleFavorite = (color) => {
    setFavColor(color);
    setIsCycling(false);
    setIsRandomMode(false);
    localStorage.setItem('favColor', color);
  };

  useEffect(() => {
    const savedFavColor = localStorage.getItem('favColor');
    if (savedFavColor) {
      setFavColor(savedFavColor);
      setIsCycling(false);
    }
  }, []);

  return (
    <div className="chat-page" style={{ backgroundColor: favColor || bgColor }}>
      <h3 className="chat-header">{otherUser || 'Loading...'}</h3>

      {/* Theme Toggle Button Section */}
      <div className="theme-toggle-container">
        <button className="theme-toggle-button" onClick={() => setShowThemes(!showThemes)}>
          {showThemes ? <FaMoon /> : <FaSun />} {/* Toggle between Sun and Moon icons */}
        </button>

        {showThemes && (
          <div className="theme-picker">
            <h4>Select a Theme Color</h4>
            <div className="color-picker">
              {colors.map((color, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: color }}
                  onClick={() => handleFavorite(color)}
                  className={`color-button ${favColor === color ? 'selected' : ''}`}
                >
                  {favColor === color ? <FaHeart /> : null}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ color: 'white' }}>Random Color Mode:</label>
              <input
                type="checkbox"
                checked={isRandomMode}
                onChange={() => {
                  setIsRandomMode(!isRandomMode);
                  setFavColor(null);
                  setIsCycling(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Chatbox Section */}
      <div className="chat-box">
        {messages.map((msg, i) => {
          const isSelf = msg.sender.username === currentUser?.username;
          return (
            <div key={i} className={`message ${isSelf ? 'message-right' : 'message-left'}`}>
              <strong>{msg.sender.username}:</strong> {msg.content}
              {isSelf && (
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(msg._id)} // Call deleteMessage with message ID
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Container Section */}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
