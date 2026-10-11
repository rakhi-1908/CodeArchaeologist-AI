import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

// Initialize the modern Hugging Face Inference Client with your API token
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

async function testHuggingFace() {
  try {
    console.log("Testing Hugging Face connection...");
    
    // Test Embedding Generation
    const embeddingResponse = await client.featureExtraction({
      model: process.env.EMBEDDING_MODEL_ID,
      inputs: "function validateUser(email, password) { return true; }"
    });
    
    console.log("✅ Embeddings success! Vector length:", embeddingResponse.length);

    // Test Chat Completion
    const chatResponse = await client.chatCompletion({
      model: process.env.LLM_MODEL_ID,
      messages: [{ role: "user", content: "Say hello in three words." }],
      max_tokens: 20
    });

    console.log("✅ LLM success! Response:", chatResponse.choices[0].message.content.trim());

  } catch (error) {
    console.error("❌ Hugging Face test failed:", error.message);
  }
}

testHuggingFace();