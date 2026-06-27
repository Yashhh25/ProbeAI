const mongoose = require('mongoose');
const env = require('./env');

async function connectDB() {
  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = connectDB;
