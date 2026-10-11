import React from 'react';

export default function DependencyGraph({ graphData }) {
  if (!graphData || !graphData.nodes) return null;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md w-full max-w-4xl mx-auto my-4">
      <h3 className="text-lg font-bold mb-3 text-purple-400">Dependency Graph Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nodes / Files */}
        <div className="bg-gray-950 p-3 rounded border border-gray-800">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Detected File Nodes</h4>
          <ul className="space-y-1 text-xs font-mono">
            {graphData.nodes.map((node) => (
              <li key={node.id} className="p-2 bg-gray-900 rounded border border-gray-800">
                <div className="font-bold text-blue-300">{node.label}</div>
                <div className="text-gray-500">{node.id}</div>
                {node.functions.length > 0 && (
                  <div className="text-green-400 text-[10px] mt-1">
                    Functions: {node.functions.join(', ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Edges / Import Relationships */}
        <div className="bg-gray-950 p-3 rounded border border-gray-800">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Import Dependencies</h4>
          {graphData.edges.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No relative imports detected.</p>
          ) : (
            <ul className="space-y-1 text-xs font-mono">
              {graphData.edges.map((edge, idx) => (
                <li key={idx} className="p-2 bg-gray-900 rounded border border-gray-800 flex items-center justify-between">
                  <span className="text-gray-300">{edge.from.split('/').pop()}</span>
                  <span className="text-purple-400 font-bold">➔ imports ➔</span>
                  <span className="text-blue-300">{edge.to.split('/').pop()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}