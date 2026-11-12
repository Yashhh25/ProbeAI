const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const interviewRoutes = require('./routes/interview.routes');
const messageRoutes = require('./routes/message.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];

if (env.clientUrl) {
  const configured = env.clientUrl
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  allowedOrigins.push(...configured);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, mobile apps, Postman, server-to-server, or /health)
    if (!origin) {
      return callback(null, true);
    }

    if (env.nodeEnv === 'development' || env.nodeEnv === 'test') {
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }
    } else {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    const error = new Error(`Origin ${origin} not allowed by CORS`);
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ProbeAI API is running',
  });
});

// Route registration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/interviews/:interviewId/messages', messageRoutes);
app.use('/api/v1/interviews/:interviewId/report', reportRoutes);
// Global error middleware placeholder
app.use((err, _req, res, _next) => {
  if (err.message && err.message.includes('not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
