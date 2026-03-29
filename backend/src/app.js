const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const boardRoutes = require('./routes/board-routes');
const listRoutes = require('./routes/list-routes');
const cardRoutes = require('./routes/card-routes');
const labelRoutes = require('./routes/label-routes');
const memberRoutes = require('./routes/member-routes');
const checklistRoutes = require('./routes/checklist-routes');

const app = express();

// Middleware
app.use(cors()); // Configure according to frontend origin in production
app.use(express.json());

// Routes
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/checklist', checklistRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
