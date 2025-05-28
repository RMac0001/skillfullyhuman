// scripts/generate-folder-structure.ts
// Generates a visual folder structure tree and saves it to outputs/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface GeneratorOptions {
  root?: string;
  outputFileName?: string;
  exclude?: string[];
  maxDepth?: number;
}

const defaultOptions: Required<GeneratorOptions> = {
  root: projectRoot,
  outputFileName: 'folder-structure.txt',
  exclude: [
    'node_modules',
    '.git',
    '*.log',
    '*.zip',
    'query.*',
    'backups',
    'mongo-log',
    'mongo-data',
    'chroma-data',
    '.next',
    'dist',
    'build',
    '*.ps1',
    'outputs', // Don't include the outputs directory in the structure
  ],
  maxDepth: 10,
};

// Tree drawing characters
const TreeChars = {
  branch: '├',
  end: '└',
  pipe: '│',
  line: '─',
} as const;

function parseArgs(): Partial<GeneratorOptions> {
  const args = process.argv.slice(2);
  const options: Partial<GeneratorOptions> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--root' && i + 1 < args.length) {
      options.root = path.resolve(args[i + 1]);
      i++;
    } else if (arg === '--output' && i + 1 < args.length) {
      options.outputFileName = args[i + 1];
      i++;
    } else if (arg === '--exclude' && i + 1 < args.length) {
      options.exclude = args[i + 1].split(',').map(s => s.trim());
      i++;
    } else if (arg === '--max-depth' && i + 1 < args.length) {
      options.maxDepth = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--help') {
      showHelp();
      process.exit(0);
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
📂 Folder Structure Generator

Usage: npx tsx scripts/generate-folder-structure.ts [options]

Options:
  --root <path>         Root directory to scan (default: project root)
  --output <filename>   Output filename (default: folder-structure.txt)
  --exclude <patterns>  Comma-separated exclude patterns
  --max-depth <number>  Maximum directory depth (default: 10)
  --help               Show this help message

Examples:
  npx tsx scripts/generate-folder-structure.ts
  npx tsx scripts/generate-folder-structure.ts --root ./src --output src-structure.txt
  npx tsx scripts/generate-folder-structure.ts --exclude "*.log,temp,dist"
`);
}

function testExclude(filePath: string, excludePatterns: string[]): boolean {
  const fileName = path.basename(filePath);
  const fullPath = filePath;

  for (const pattern of excludePatterns) {
    // Handle glob patterns with asterisks
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);

      if (regex.test(fileName) || regex.test(path.basename(fullPath))) {
        return true;
      }
    } else {
      // Handle exact matches and directory names
      if (
        fileName === pattern ||
        fullPath.includes(`${path.sep}${pattern}${path.sep}`) ||
        fullPath.endsWith(`${path.sep}${pattern}`)
      ) {
        return true;
      }
    }
  }

  return false;
}

function writeTree(
  basePath: string,
  indent: string = '',
  excludePatterns: string[],
  maxDepth: number,
  currentDepth: number = 0,
): string[] {
  const lines: string[] = [];

  if (currentDepth >= maxDepth) {
    return lines;
  }

  try {
    let items = fs.readdirSync(basePath, { withFileTypes: true });

    // Filter out excluded items
    items = items.filter(item => {
      const itemPath = path.join(basePath, item.name);
      return !testExclude(itemPath, excludePatterns);
    });

    // Sort: directories first, then files, both alphabetically
    items.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    items.forEach((item, index) => {
      const isLastItem = index === items.length - 1;

      const prefix = isLastItem
        ? `${TreeChars.end}${TreeChars.line}${TreeChars.line} `
        : `${TreeChars.branch}${TreeChars.line}${TreeChars.line} `;

      const nextIndent = isLastItem
        ? `${indent}    `
        : `${indent}${TreeChars.pipe}   `;

      const displayName = item.isDirectory() ? `${item.name}/` : item.name;
      const line = `${indent}${prefix}${displayName}`;
      lines.push(line);

      if (item.isDirectory()) {
        const itemPath = path.join(basePath, item.name);
        const subLines = writeTree(
          itemPath,
          nextIndent,
          excludePatterns,
          maxDepth,
          currentDepth + 1,
        );
        lines.push(...subLines);
      }
    });
  } catch (error) {
    const errorLine = `${indent}${TreeChars.branch}${TreeChars.line}${TreeChars.line} [Error reading directory]`;
    lines.push(errorLine);
  }

  return lines;
}

function generateStats(lines: string[]): string {
  const directories = lines.filter(line => line.endsWith('/')).length;
  const files =
    lines.filter(line => !line.endsWith('/') && !line.includes('[Error'))
      .length - 1; // -1 for root
  const errors = lines.filter(line => line.includes('[Error')).length;

  return `
📊 Statistics:
   Directories: ${directories}
   Files: ${files}
   ${errors > 0 ? `Errors: ${errors}` : ''}
   Total items: ${directories + files}
`;
}

async function generateFolderStructure(
  options: Partial<GeneratorOptions> = {},
): Promise<void> {
  const config = { ...defaultOptions, ...options };

  // Ensure outputs directory exists
  const outputsDir = path.join(projectRoot, 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const outputPath = path.join(outputsDir, config.outputFileName);
  const logFile = path.join(outputsDir, 'folder-structure-generation.log');

  function writeLog(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(message);
    fs.appendFileSync(logFile, logEntry + '\n');
  }

  try {
    writeLog('🌳 Generating folder structure...');
    writeLog(`📁 Root: ${config.root}`);
    writeLog(`📄 Output: ${outputPath}`);
    writeLog(`🚫 Excluding: ${config.exclude.join(', ')}`);
    writeLog(`📏 Max depth: ${config.maxDepth}`);

    // Check if root directory exists
    if (!fs.existsSync(config.root)) {
      throw new Error(`Root directory does not exist: ${config.root}`);
    }

    // Build the tree
    const lines: string[] = [];
    const rootName = path.basename(config.root) || '/';
    lines.push(rootName + '/');

    const treeLines = writeTree(
      config.root,
      '',
      config.exclude,
      config.maxDepth,
    );

    lines.push(...treeLines);

    // Generate metadata
    const stats = generateStats(lines);
    const metadata = `
Generated: ${new Date().toISOString()}
Root: ${config.root}
Excluded patterns: ${config.exclude.join(', ')}
Max depth: ${config.maxDepth}
${stats}
${'='.repeat(50)}

`;

    // Write to file
    const content = metadata + lines.join('\n');
    fs.writeFileSync(outputPath, content, 'utf8');

    writeLog(`✅ Folder structure written to ${outputPath}`);
    writeLog(`📊 Generated ${lines.length} lines`);

    // Also save a JSON version for programmatic use
    const jsonOutput = {
      metadata: {
        generated: new Date().toISOString(),
        root: config.root,
        excludePatterns: config.exclude,
        maxDepth: config.maxDepth,
        statistics: {
          totalLines: lines.length,
          directories: lines.filter(line => line.endsWith('/')).length,
          files:
            lines.filter(
              line => !line.endsWith('/') && !line.includes('[Error'),
            ).length - 1,
        },
      },
      structure: lines,
    };

    const jsonPath = path.join(outputsDir, 'folder-structure.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));
    writeLog(`📋 JSON structure saved to ${jsonPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    writeLog(`❌ Error: ${errorMessage}`);
    process.exit(1);
  }
}

// Main execution
const options = parseArgs();
generateFolderStructure(options).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
