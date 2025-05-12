// zip-project.js
import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('output.zip');
const archive = archiver('zip', { zlib: { level: 9 } }); // Max compression

output.on('close', () => {
  console.log(`✅ Zip complete: ${archive.pointer()} bytes`);
});

archive.on('error', err => {
  console.error('❌ Zip failed:', err);
  process.exit(1);
});

archive.pipe(output);

// Add everything except excluded patterns
archive.glob('**/*', {
  ignore: [
    'node_modules/**',
    '.git/**',
    '*.log',
    '*.zip',
    'query.*',
    'backups/**',
    'mongo-log/**',
    'mongo-data/**',
    'chroma-data/**',
    '.next/**',
  ],
  dot: true, // include dotfiles unless excluded
});

archive.finalize();
