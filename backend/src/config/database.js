const mongoose = require('mongoose');
const env = require('./env');

// Register Mongoose connection lifecycle listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Underlying driver attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB connection re-established');
});

async function connectDB() {
  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB initial connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = connectDB;
