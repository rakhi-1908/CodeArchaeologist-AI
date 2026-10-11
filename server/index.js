import express from 'express';
import cors from 'cors';
import path from 'path';
import { analyzeCodeFile } from './parser.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeArchaeologist Repo Intelligence API running' });
});

// Endpoint to parse a local file
app.post('/api/parse-file', (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  const absolutePath = path.resolve(filePath);
  const result = analyzeCodeFile(absolutePath);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Repository Intelligence Server running on port ${PORT}`);
});