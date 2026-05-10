const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tripsRoutes = require('./routes/trips');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);

// Protected Endpoint Example
// This endpoint expects a JWT token in the Authorization header
app.get('/api/test-auth', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: 'Token is valid!', user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    // Test DB Connection
    await db.query('SELECT 1');
    console.log('Successfully connected to the MySQL Database.');
  } catch (err) {
    console.error('Failed to connect to the MySQL Database. Please check your credentials in .env and make sure MySQL is running.');
  }
});
