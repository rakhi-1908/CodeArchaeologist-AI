import express from 'express';
import { askRepository } from '../services/ai/rag.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { question, indexedChunks } = req.body ?? {};

  if (!question || !indexedChunks) {
    return res.status(400).json({
      error: 'Both question and indexedChunks are required.'
    });
  }

  if (typeof question !== 'string' || !Array.isArray(indexedChunks)) {
    return res.status(400).json({
      error: 'question must be a string and indexedChunks must be an array.'
    });
  }

  try {
    const result = await askRepository(indexedChunks, question);
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Failed to answer question: ${message}` });
  }
});

export default router;
