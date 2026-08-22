require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const activityRoutes = require('./routes/activityRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const tripRoutes = require('./routes/tripRoutes');
const cityRoutes = require('./routes/cityRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GlobeTrotter API',
    timestamp: new Date().toISOString(),
    members: ['Member 1 (Auth + Dashboard + Profile)', 'Member 3 (Activities + Itinerary + Calendar)'],
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌍 GlobeTrotter Server running on http://localhost:${PORT}`);
    console.log(`🔐 Auth API:        http://localhost:${PORT}/api/auth`);
    console.log(`👤 Profile API:     http://localhost:${PORT}/api/profile`);
    console.log(`📍 Activities API:  http://localhost:${PORT}/api/activities`);
    console.log(`🗓️  Itinerary API:   http://localhost:${PORT}/api/trips/:tripId/itinerary`);
  });
}

module.exports = app;
