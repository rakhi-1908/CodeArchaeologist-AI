import { parseRepoUrl, getRepoTree, getFileContent } from './githubService.js';
import { analyzeCodeString } from './parser.js';

export async function buildDependencyGraph(repoUrl, branch = 'main') {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const tree = await getRepoTree(owner, repo, branch);

  // Filter for JavaScript/TypeScript files
  const codeFiles = tree.filter(item => 
    item.path.endsWith('.js') || item.path.endsWith('.jsx') || 
    item.path.endsWith('.ts') || item.path.endsWith('.tsx')
  );

  const nodes = [];
  const edges = [];
  const parsedFiles = {};

  // Step 1: Parse all code files
  for (const file of codeFiles) {
    try {
      const rawCode = await getFileContent(owner, repo, file.path, branch);
      const parsed = analyzeCodeString(rawCode, file.path);
      
      parsedFiles[file.path] = parsed;
      nodes.push({
        id: file.path,
        label: file.path.split('/').pop(),
        type: 'file',
        functions: parsed.functions || [],
        routes: parsed.routes || []
      });
    } catch {
      // Skip files that fail parsing
    }
  }

  // Step 2: Build dependency edges by matching imports
  for (const [filePath, fileData] of Object.entries(parsedFiles)) {
    if (!fileData.imports) continue;

    for (const imp of fileData.imports) {
      const sourcePath = imp.source;

      // Check if it's a relative/local file import
      if (sourcePath.startsWith('.')) {
        const targetPath = resolveImportPath(filePath, sourcePath, Object.keys(parsedFiles));
        if (targetPath) {
          edges.push({
            from: filePath,
            to: targetPath,
            label: 'imports',
            specifiers: imp.specifiers
          });
        }
      }
    }
  }

  return { nodes, edges };
}

// Helper to resolve relative import paths (e.g., './parser.js' or '../utils')
function resolveImportPath(currentFilePath, importSource, availablePaths) {
  const currentDir = currentFilePath.split('/').slice(0, -1).join('/');
  const rawTarget = currentDir ? `${currentDir}/${importSource}` : importSource;
  
  const normalized = normalizePath(rawTarget);
  
  // Try exact match or match with common code extensions
  const candidates = [
    normalized,
    `${normalized}.js`,
    `${normalized}.jsx`,
    `${normalized}.ts`,
    `${normalized}.tsx`,
    `${normalized}/index.js`
  ];

  return availablePaths.find(p => candidates.includes(p)) || null;
}

function normalizePath(pathStr) {
  const parts = pathStr.split('/');
  const stack = [];
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return stack.join('/');
}