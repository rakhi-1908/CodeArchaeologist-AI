import { pipeline } from '@huggingface/transformers';

// Cache the pipeline instance so the model loads only once
let extractorInstance = null;

async function getExtractor() {
  if (!extractorInstance) {
    console.log("📥 Loading local embedding model (Xenova/all-MiniLM-L6-v2)...");
    extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log("✅ Local embedding model loaded successfully!");
  }
  return extractorInstance;
}

/**
 * Generates a numerical vector embedding for the given text locally.
 * @param {string} text - Code snippet or question text
 * @returns {Promise<number[]>} - Numeric embedding vector array
 */
export async function getEmbedding(text) {
  if (!text || typeof text !== 'string') {
    throw new Error("Invalid text input provided for embedding generation.");
  }

  const extractor = await getExtractor();
  
  // Extract features with mean pooling and normalization
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  
  // Convert the tensor output to a standard JavaScript array
  return Array.from(output.data);
}