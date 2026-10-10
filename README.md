# 🏛️ CodeArchaeologist AI

**CodeArchaeologist AI** is an intelligent, Retrieval-Augmented Generation (RAG) based code assistant that transforms complex codebases into conversational knowledge bases. Instead of manually digging through dozens of files, developers can ask questions in plain English and receive precise, grounded answers complete with file paths, line ranges, and exact code citations.

---

## ✨ Key Features

- **Conversational Code Queries:** Ask natural language questions about your repository (e.g., *"Where is user authentication handled?"* or *"How are API errors structured?"*) and get direct, contextual answers.
- **Pinpoint Citations:** Every response includes exact references to the source file, line numbers, and associated code symbols (functions, classes, or constants) so you can verify the logic instantly.
- **Semantic Code Retrieval:** Powered by local vector embeddings (`Xenova/all-MiniLM-L6-v2`), the system matches your questions against the codebase using deep contextual similarity rather than simple keyword matching.
- **Smart Code Chunking:** Automatically slices large source files into manageable, overlapping code blocks while intelligently tracking function and class definitions to preserve context.
- **Hallucination Safeguards:** Designed with strict system prompts that force the AI to answer *only* using provided repository snippets, admitting when information is missing rather than guessing.

---

## 🔍 How It Works

1. **Ingestion & Chunking:** Source files are broken down into logical code chunks, preserving metadata like file paths, programming languages, and start/end lines.
2. **Vector Embeddings:** Code chunks and user queries are converted into high-dimensional vector representations locally for fast, privacy-focused semantic analysis.
3. **Similarity Retrieval:** The engine performs a cosine similarity search to surface the top most relevant code blocks matching your query.
4. **Grounded Generation:** A state-of-the-art language model synthesizes the retrieved snippets into a clear, comprehensive explanation with clear code citations.

---

## 🔌 API Integration

CodeArchaeologist AI exposes a clean REST API endpoint for querying indexed repositories:

- **Endpoint:** `POST /api/questions`
- **Payload Structure:**
  ```json
  {
    "question": "Where is token generation implemented?",
    "indexedChunks": [
      {
        "path": "backend/auth.js",
        "language": "javascript",
        "symbol": "createSession",
        "startLine": 10,
        "endLine": 15,
        "content": "function createSession(userId) { ... }"
      }
    ]
  }