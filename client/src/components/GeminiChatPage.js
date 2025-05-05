import React, { useState, useEffect, useRef } from 'react';
import './GeminiChatPage.css'; // Import updated CSS

// Function to send a message to the backend and get the response
const sendMessageToGemini = async (message, userId) => {
  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, userId }),  // Include userId in the request body
    });

    const data = await response.json();
    console.log('Gemini response:', data);
    return data.response;  // Return the Gemini response text
  } catch (error) {
    console.error('Error communicating with Gemini:', error);
    return "Sorry, there was an error communicating with Gemini.";
  }
};

const GeminiChatPage = () => {
  const [messages, setMessages] = useState([]); // Manage chat messages
  const [userInput, setUserInput] = useState(''); // Manage user input
  const [userId, setUserId] = useState('user123');  // Set a default userId or retrieve it from a system
  const messagesEndRef = useRef(null); // To auto-scroll to the latest message
  const [loading, setLoading] = useState(false); // To show loading spinner

  // Automatically scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      // Add user message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: userInput },
      ]);
      setUserInput(''); // Clear the input field
      setLoading(true); // Show loading spinner

      // Send the message to Gemini API and wait for the response
      const geminiResponse = await sendMessageToGemini(userInput, userId);

      setLoading(false); // Hide loading spinner

      if (!geminiResponse) {
        console.error('No response from Gemini');
        return;
      }

      // Check if the response is a code snippet (wrapped in backticks)
      const isCode = geminiResponse.startsWith("```") && geminiResponse.endsWith("```");

      // Add Gemini's response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'gemini',
          text: geminiResponse,
          isCode: isCode,
        },
      ]);
    }
  };

  // Handle Enter key press to send the message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
      handleSendMessage();
    }
  };

  return (
    <div className="gemini-chat-page">
      <h2>Gemini Chat</h2>
      <div className="chatbox">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div
                className={`message-bubble ${msg.isCode ? 'code-block' : ''}`}
              >
                {msg.isCode ? (
                  // Render code as block
                  <pre className="code-box">{msg.text.replace(/```/g, '')}</pre>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {/* Show loading spinner when waiting for Gemini response */}
          {loading && (
            <div className="message gemini">
              <div className="spinner-wrapper">
                <div className="spinner" />
                <div className="typing">Gemini is typing...</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}  // Add onKeyPress event listener
            placeholder="Type your message"
            autoFocus
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatPage;
