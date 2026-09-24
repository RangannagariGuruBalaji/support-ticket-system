require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// Permissive CORS middleware for dev/evaluation across ports (3000, 3001, etc.)
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));

// 404 Fallback & Error Handling
app.use('/api/*', notFoundHandler);
app.use(errorHandler);

module.exports = app;
