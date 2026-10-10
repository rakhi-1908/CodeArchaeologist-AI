import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function generateLLMAnswer(question, relevantChunks) {
  if (typeof question !== 'string' || !question.trim()) {
    throw new TypeError('Question must be a non-empty string.');
  }

  if (!Array.isArray(relevantChunks)) {
    throw new TypeError('Relevant chunks must be provided as an array.');
  }

  const context = relevantChunks
    .map((chunk) => `${chunk.path}:${chunk.startLine}-${chunk.endLine}\n${chunk.content}`)
    .join('\n\n');

  try {
    const response = await client.chatCompletion({
      model: process.env.LLM_MODEL_ID,
      messages: [
        {
          role: 'system',
          content: [
            'You are CodeArchaeologist AI, an expert assistant for understanding code.',
            'Answer the user question ONLY using the provided code snippets.',
            'Cite supporting evidence using each snippet file path and line numbers.',
            'Do not infer or invent behavior that is not shown in the snippets.',
            'If the snippets do not provide enough evidence to answer, say so clearly.'
          ].join(' ')
        },
        {
          role: 'user',
          content: `Code snippets:\n${context || '(No relevant code snippets were provided.)'}\n\nQuestion: ${question}`
        }
      ],
      max_tokens: 500
    });

    const answer = response.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error('Hugging Face returned an empty response.');
    }

    return answer.trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate code explanation: ${message}`, { cause: error });
  }
}
