import { retrieveRelevantChunks } from './retriever.js';
import { generateLLMAnswer } from './llm.js';

export async function askRepository(indexedChunks, question) {
  const relevantChunks = await retrieveRelevantChunks(question, indexedChunks, 4);
  const answer = await generateLLMAnswer(question, relevantChunks);

  return {
    answer,
    citations: relevantChunks.map(({ path, startLine, endLine }) => ({
      path,
      startLine,
      endLine
    })),
    relatedFiles: [...new Set(relevantChunks.map(({ path }) => path))]
  };
}
