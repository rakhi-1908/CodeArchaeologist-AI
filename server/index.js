import express from 'express';
import cors from 'cors';
import path from 'path';
import { analyzeCodeFile, analyzeCodeString } from './parser.js';
import { parseRepoUrl, getRepoTree, getFileContent } from './githubService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeArchaeologist Repo Intelligence API running' });
});

// Parse local file
app.post('/api/parse-file', (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  const absolutePath = path.resolve(filePath);
  const result = analyzeCodeFile(absolutePath);
  res.json(result);
});

// Fetch repository file tree from GitHub
app.post('/api/github/tree', async (req, res) => {
  const { repoUrl, branch } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  try {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const tree = await getRepoTree(owner, repo, branch || 'main');
    res.json({ owner, repo, totalFiles: tree.length, tree });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch and parse remote file directly from GitHub
app.post('/api/github/parse-remote', async (req, res) => {
  const { repoUrl, filePath, branch } = req.body;
  if (!repoUrl || !filePath) {
    return res.status(400).json({ error: 'repoUrl and filePath are required' });
  }

  try {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const rawCode = await getFileContent(owner, repo, filePath, branch || 'main');
    const parsedData = analyzeCodeString(rawCode, `${owner}/${repo}/${filePath}`);
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Repository Intelligence Server running on port ${PORT}`);
});