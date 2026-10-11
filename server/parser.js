const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function analyzeCodeFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');

    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const structure = {
      filePath,
      imports: [],
      functions: [],
      classes: [],
      routes: []
    };

    traverse(ast, {
      ImportDeclaration(path) {
        structure.imports.push({
          source: path.node.source.value,
          specifiers: path.node.specifiers.map(s => s.local.name)
        });
      },
      FunctionDeclaration(path) {
        if (path.node.id) {
          structure.functions.push(path.node.id.name);
        }
      },
      ClassDeclaration(path) {
        if (path.node.id) {
          structure.classes.push(path.node.id.name);
        }
      },
      CallExpression(path) {
        const callee = path.node.callee;
        if (callee.type === 'MemberExpression') {
          const method = callee.property.name;
          if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
            const firstArg = path.node.arguments[0];
            if (firstArg && firstArg.type === 'StringLiteral') {
              structure.routes.push({
                method: method.toUpperCase(),
                path: firstArg.value
              });
            }
          }
        }
      }
    });

    return structure;
  } catch (error) {
    return { filePath, error: error.message };
  }
}

module.exports = { analyzeCodeFile };