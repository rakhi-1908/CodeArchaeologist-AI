import React, { useState } from 'react';

export default function RepoExplorer({ onSelectFile, repoUrl, setRepoUrl, fetchRepoData, tree, loading }) {
  const [selectedPath, setSelectedPath] = useState('');

  const handleFileClick = (filePath) => {
    setSelectedPath(filePath);
    onSelectFile(filePath);
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md w-full max-w-4xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Repository Explorer</h2>
      
      {/* Input bar for Repo URL */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="owner/repo or full GitHub URL"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchRepoData}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-semibold transition"
        >
          {loading ? 'Analyzing...' : 'Ingest Repo'}
        </button>
      </div>

      {/* File Tree View */}
      {tree && tree.length > 0 && (
        <div className="bg-gray-950 p-4 rounded border border-gray-800 max-h-80 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">PROJECT FILES ({tree.length})</h3>
          <ul className="space-y-1 text-sm font-mono">
            {tree.map((file) => (
              <li
                key={file.path}
                onClick={() => handleFileClick(file.path)}
                className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-800 transition ${
                  selectedPath === file.path ? 'bg-blue-900 text-blue-200 font-bold' : 'text-gray-300'
                }`}
              >
                📄 {file.path}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}