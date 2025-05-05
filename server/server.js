const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config(); // Load .env variables
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini

// Route files
const authRoutes = require('./routers/auth');
const postsRoutes = require('./routers/posts');
const dashboardRoutes = require('./routers/dashboard');
const messageRoutes = require('./routers/messages');
const userRoutes = require('./routers/users');
const authenticateToken = require('./middleware/auth');

const app = express();

// ✅ Allow local and deployed frontends dynamically
const allowedOrigins = [
  process.env.CLIENT_URL, // e.g., http://localhost:3000
  process.env.PRODUCTION_URL // your production frontend URL
];

// ✅ CORS middleware setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Gemini Chat Endpoint
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Load the Gemini API key from .env

// Memory-based conversation history (optional)
// let conversationHistory = {}; // For storing messages in memory

// Import database model
const Conversation = require('./models/Conversation'); // MongoDB model for conversation

// Gemini Chat API route with memory (Database-based)
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.body.userId; // Assuming each user has a unique ID
  
  if (!userId) {
    return res.status(400).json({ response: 'User ID is required.' });
  }

  // Fetch or create conversation history from DB
  let conversation = await Conversation.findOne({ userId });
  if (!conversation) {
    conversation = new Conversation({ userId, history: [] });
  }

  // Add the user's message to the history
  conversation.history.push({ role: 'user', message: userMessage });

  try {
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat();

    // Use the entire conversation history for context
    const contextMessages = conversation.history.map(entry => `${entry.role}: ${entry.message}`).join("\n");

    const result = await chat.sendMessage(`${contextMessages}\nuser: ${userMessage}`);
    const geminiResponse = await result.response;

    if (geminiResponse && geminiResponse.text) {
      // Add the bot's reply to the history
      conversation.history.push({ role: 'bot', message: geminiResponse.text() });

      // Save the updated conversation in the database
      await conversation.save();

      res.json({ response: geminiResponse.text() });
    } else {
      res.status(500).json({ response: "Gemini did not return a valid response." });
    }
  } catch (error) {
    console.error("Error during Gemini chat:", error);
    res.status(500).json({ response: "Sorry, something went wrong with Gemini." });
  }
});

// Fitness AI Endpoint
app.get('/fitness', (req, res) => {
  res.sendFile(path.join(__dirname, 'fitness.html'));
});

app.post('/start-fitness', (req, res) => {
  const pythonProcess = spawn('python', ['fitness_ai.py']);

  pythonProcess.stdout.on('data', (data) => {
    const result = JSON.parse(data.toString());
    console.log(result);
    res.json(result);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Error:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Protected test route
app.get('/api/test', authenticateToken, (req, res) => {
  res.json({ message: 'Token is valid ✅', user: req.user });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Database connected');
})
.catch((err) => {
  console.error('❌ Database connection failed:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
