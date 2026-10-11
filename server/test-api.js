const payload = {
  question: 'Where is password validation implemented?',
  indexedChunks: [
    {
      path: 'src/auth.js',
      language: 'javascript',
      symbol: 'validatePassword',
      startLine: 1,
      endLine: 5,
      content: [
        'const MIN_PASSWORD_LENGTH = 8;',
        '',
        'function validatePassword(password) {',
        '  return password.length >= MIN_PASSWORD_LENGTH;',
        '}'
      ].join('\n')
    }
  ]
};

try {
  const response = await fetch('http://localhost:5000/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${JSON.stringify(result)}`);
  }

  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`API test failed: ${message}`);
  process.exitCode = 1;
}
