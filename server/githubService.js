import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

// Parse "owner/repo" from GitHub URLs or raw strings
export function parseRepoUrl(repoInput) {
  const cleaned = repoInput.replace(/https?:\/\/github\.com\//, '').replace(/\.git$/, '');
  const parts = cleaned.split('/');
  if (parts.length < 2) {
    throw new Error('Invalid repository format. Expected "owner/repo" or full GitHub URL.');
  }
  return { owner: parts[0], repo: parts[1] };
}

// Fetch complete file tree from a remote GitHub repository
export async function getRepoTree(owner, repo, branch = 'main') {
  try {
    const { data } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: '1'
    });
    
    // Filter out build assets, lock files, and node_modules
    return data.tree
      .filter(item => item.type === 'blob' && !item.path.includes('node_modules/') && !item.path.startsWith('.'))
      .map(item => ({
        path: item.path,
        size: item.size,
        url: item.url
      }));
  } catch (error) {
    throw new Error(`Failed to fetch repo tree: ${error.message}`);
  }
}

// Fetch raw file content from GitHub
export async function getFileContent(owner, repo, filePath, branch = 'main') {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch
    });

    if (data.type !== 'file' || !data.content) {
      throw new Error('Requested path is not a valid file');
    }

    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
}