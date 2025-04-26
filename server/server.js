const express = require('express');
require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routers/auth');         // /api/auth
const postsRoutes = require('./routers/posts');       // /api/posts
const dashboardRoutes = require('./routers/dashboard'); // /api/dashboard
const authenticateToken = require('./middleware/auth'); // Middleware to verify JWT
const messageRoutes = require('./routers/messages');
const app = express();

// Middleware
app.use(cors({
  origin: '*',  // Allow all domains to access your API
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// ✅ Protected test route
app.get('/api/test', authenticateToken, (req, res) => {
  res.json({ message: 'Token is valid ✅', user: req.user });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
