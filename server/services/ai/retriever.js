import { getEmbedding } from './embeddings.js';

/**
 * Calculates the cosine similarity between two numeric vectors.
 */
function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    throw new Error("Both embeddings must be numeric vectors.");
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieves the top-K most relevant chunks for a given question using semantic similarity.
 * @param {string} question - User question
 * @param {Array} chunks - Array of code chunks
 * @param {number} topK - Number of top chunks to return
 */
export async function retrieveRelevantChunks(question, chunks, topK = 3) {
  if (!question || !chunks || chunks.length === 0) {
    return [];
  }

  // 1. Generate embedding for the question
  const questionEmbedding = await getEmbedding(question);

  const scoredChunks = [];

  // 2. Iterate through chunks, generate or use their embedding, and compute similarity
  for (const chunk of chunks) {
    // If the chunk doesn't have an embedding yet, generate it from its content
    const chunkEmbedding = chunk.embedding || await getEmbedding(chunk.content);
    
    const score = cosineSimilarity(questionEmbedding, chunkEmbedding);
    scoredChunks.push({
      ...chunk,
      score
    });
  }

  // 3. Sort by similarity score descending and slice top-K
  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK);
}