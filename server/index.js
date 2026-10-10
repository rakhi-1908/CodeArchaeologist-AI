import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questionsRouter from './routes/questions.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount your AI questions route
app.use('/api/questions', questionsRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: "success", message: "CodeArchaeologist AI Backend is running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 CodeArchaeologist AI server running on port ${PORT}`);
});