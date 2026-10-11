const SYMBOL_PATTERNS = [
  /\bfunction\s*\*?\s+([$A-Z_a-z][$\w]*)/,
  /\bclass\s+([$A-Z_a-z][$\w]*)/,
  /\bconst\s+([$A-Z_a-z][$\w]*)/
];

export function chunkFile(file, maxLinesPerChunk = 25, overlap = 5) {
  if (!file || typeof file !== 'object') {
    throw new TypeError('File must be an object containing path, language, and content.');
  }

  if (typeof file.content !== 'string') {
    throw new TypeError('File content must be a string.');
  }

  if (!Number.isInteger(maxLinesPerChunk) || maxLinesPerChunk <= 0) {
    throw new RangeError('maxLinesPerChunk must be a positive integer.');
  }

  if (!Number.isInteger(overlap) || overlap < 0 || overlap >= maxLinesPerChunk) {
    throw new RangeError('overlap must be a non-negative integer less than maxLinesPerChunk.');
  }

  if (file.content.length === 0) {
    return [];
  }

  const lines = file.content.split(/\r\n|\n|\r/);
  if (/(?:\r\n|\n|\r)$/.test(file.content)) {
    lines.pop();
  }

  const chunks = [];
  const step = maxLinesPerChunk - overlap;

  for (let startIndex = 0; startIndex < lines.length; startIndex += step) {
    const chunkLines = lines.slice(startIndex, startIndex + maxLinesPerChunk);
    const symbol = chunkLines
      .map((line) => SYMBOL_PATTERNS.map((pattern) => line.match(pattern)?.[1]).find(Boolean))
      .find(Boolean) ?? 'block';

    chunks.push({
      path: file.path,
      language: file.language,
      symbol,
      startLine: startIndex + 1,
      endLine: startIndex + chunkLines.length,
      content: chunkLines.join('\n')
    });

    if (startIndex + chunkLines.length >= lines.length) {
      break;
    }
  }

  return chunks;
}

export function chunkRepository(files) {
  if (!Array.isArray(files)) {
    throw new TypeError('Files must be provided as an array.');
  }

  return files.flatMap((file) => chunkFile(file));
}
