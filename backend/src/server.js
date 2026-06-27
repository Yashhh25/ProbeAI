const app = require('./app');
const connectDB = require('./config/database');
const env = require('./config/env');

async function startServer() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`ProbeAI server running on port ${env.port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : reason;
  console.error('Unhandled Rejection:', message);
  process.exit(1);
});

startServer();
