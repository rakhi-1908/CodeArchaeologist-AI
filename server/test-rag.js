import { chunkRepository } from './services/ai/chunker.js';
import { askRepository } from './services/ai/rag.js';

// 1. Mock the files your friend's module will supply
const sampleRepositoryFiles = [
  {
    path: "backend/auth.js",
    language: "javascript",
    content: `
      // Authentication and security module
      function validateUser(email, password) {
        if (!email || password.length < 8) {
          throw new Error("Invalid credentials or weak password.");
        }
        return true;
      }

      function createSession(userId) {
        return { token: "secret_jwt_token_123", userId };
      }
    `
  }
];

async function runRAGTest() {
  console.log("1. Chunking repository files...");
  const indexedChunks = chunkRepository(sampleRepositoryFiles);
  console.log(`✅ Generated ${indexedChunks.length} chunks.`);

  const question = "Where is user password validation handled?";
  console.log(`\n2. Asking question: "${question}"`);

  try {
    const result = await askRepository(indexedChunks, question);
    console.log("\n--- AI RAG Response ---");
    console.log("Answer:\n", result.answer);
    console.log("\nCitations:", result.citations);
    console.log("Related Files:", result.relatedFiles);
  } catch (error) {
    console.error("❌ RAG Pipeline test failed:", error.message);
  }
}

runRAGTest();node server/test-rag.js