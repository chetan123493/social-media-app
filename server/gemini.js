const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');  // Import CORS

const app = express();
const port = 5002;

// Your Gemini API key
const API_KEY = "AIzaSyAH01qsIr6-CZHFqOs0WmbVZWF_WnyRoMM";  // Make sure your API key is correct
const genAI = new GoogleGenerativeAI(API_KEY);

// Use CORS middleware to allow requests from your frontend (localhost:3000)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Chat endpoint to interact with Gemini
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat();

    // Send the user's message and get the response
    const result = await chat.sendMessage(userMessage);
    const geminiResponse = await result.response;

    res.json({ response: geminiResponse.text() });  // Send response to frontend
  } catch (error) {
    console.error("Error during chat:", error);
    res.status(500).json({ response: "Sorry, there was an error processing your message." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
