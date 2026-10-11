import { chunkRepository } from './services/ai/chunker.js';

const sampleFiles = [
  {
    path: 'src/auth.js',
    language: 'javascript',
    content: [
      'const MIN_PASSWORD_LENGTH = 8;',
      '',
      'function validatePassword(password) {',
      '  return password.length >= MIN_PASSWORD_LENGTH;',
      '}',
      '',
      'class AuthService {}'
    ].join('\n')
  }
];

const chunks = chunkRepository(sampleFiles);
console.log(JSON.stringify(chunks, null, 2));
