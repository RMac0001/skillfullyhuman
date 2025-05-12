// File: scripts/generate-code-map.ts

import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

const baseDir = path.resolve(__dirname, '..');
const outputPath = path.join(baseDir, '.code-map.json');

// Custom classification rules
const rules = [
  { match: 'lib/db/models/mongo', type: 'model', db: 'mongo' },
  { match: 'lib/db/models/chroma', type: 'model', db: 'chroma' },
  { match: 'components', type: 'component', framework: 'react' },
  { match: 'types', type: 'type-def' },
  { match: 'utils', type: 'utility' },
  { match: 'scripts', type: 'script' },
  { match: 'tests', type: 'test' },
  { match: 'pages', type: 'route' },
];

async function run() {
  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd: baseDir,
    ignore: ['node_modules/**', 'dist/**', '.next/**'],
  });

  const project = new Project();
  const fileMap: Record<string, any> = {};

  for (const fileRelPath of files) {
    const absPath = path.join(baseDir, fileRelPath);
    const match = rules.find(rule => fileRelPath.includes(rule.match));
    const sourceFile = project.addSourceFileAtPath(absPath);
    const exports = sourceFile.getExportSymbols().map(s => s.getName());

    fileMap[fileRelPath] = {
      type: match?.type || 'unknown',
      purpose: match
        ? `Inferred as ${match.type} from path`
        : 'Could not infer purpose',
      exports,
      db: match?.db,
      framework: match?.framework,
    };
  }

  fs.writeFileSync(outputPath, JSON.stringify(fileMap, null, 2));
  console.log(
    `✅ .code-map.json written with ${Object.keys(fileMap).length} entries`,
  );
}

run();
