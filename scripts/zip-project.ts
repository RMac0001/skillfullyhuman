// scripts/zip-project.ts
// Creates a compressed archive of the project, excluding development files

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface ZipOptions {
  outputName?: string;
  compressionLevel?: number;
  exclude?: string[];
  includeOutputs?: boolean;
  dryRun?: boolean;
}

const defaultOptions: Required<ZipOptions> = {
  outputName: `project-backup-${new Date().toISOString().slice(0, 10)}.zip`,
  compressionLevel: 9,
  exclude: [
    'node_modules/**',
    '.git/**',
    '*.log',
    '*.zip',
    '*.tar.gz',
    'query.*',
    'backups/**',
    'mongo-log/**',
    'mongo-data/**',
    'chroma-data/**',
    '.next/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '.nyc_output/**',
    'outputs/**', // Exclude by default unless specified
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.tmp',
    '**/*.temp',
  ],
  includeOutputs: false,
  dryRun: false,
};

function parseArgs(): Partial<ZipOptions> {
  const args = process.argv.slice(2);
  const options: Partial<ZipOptions> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output' && i + 1 < args.length) {
      options.outputName = args[i + 1];
      i++;
    } else if (arg === '--compression' && i + 1 < args.length) {
      options.compressionLevel = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--exclude' && i + 1 < args.length) {
      options.exclude = args[i + 1].split(',').map(s => s.trim());
      i++;
    } else if (arg === '--include-outputs') {
      options.includeOutputs = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help') {
      showHelp();
      process.exit(0);
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
📦 Project Zip Creator

Usage: npx tsx scripts/zip-project.ts [options]

Options:
  --output <filename>      Output zip filename (default: project-backup-YYYY-MM-DD.zip)
  --compression <level>    Compression level 0-9 (default: 9)
  --exclude <patterns>     Comma-separated exclude patterns (adds to defaults)
  --include-outputs        Include the outputs directory
  --dry-run               Show what would be zipped without creating archive
  --help                  Show this help message

Examples:
  npx tsx scripts/zip-project.ts
  npx tsx scripts/zip-project.ts --output my-project.zip
  npx tsx scripts/zip-project.ts --include-outputs --compression 6
  npx tsx scripts/zip-project.ts --exclude "*.test.ts,temp/**" --dry-run

Default exclusions:
  - node_modules, .git, .next, dist, build
  - Log files, zip files, temporary files
  - Database data directories
  - Coverage reports
  - outputs directory (unless --include-outputs is used)
`);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getProjectInfo(): { name: string; version: string } {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return {
      name: packageJson.name || 'unknown-project',
      version: packageJson.version || '0.0.0',
    };
  } catch {
    return { name: 'unknown-project', version: '0.0.0' };
  }
}

async function createProjectZip(
  options: Partial<ZipOptions> = {},
): Promise<void> {
  const config = { ...defaultOptions, ...options };

  // Ensure outputs directory exists
  const outputsDir = path.join(projectRoot, 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const outputPath = path.join(outputsDir, config.outputName);
  const logFile = path.join(outputsDir, 'zip-creation.log');

  function writeLog(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(message);
    fs.appendFileSync(logFile, logEntry + '\n');
  }

  try {
    const projectInfo = getProjectInfo();

    writeLog('📦 Creating project archive...');
    writeLog(`📁 Project: ${projectInfo.name} v${projectInfo.version}`);
    writeLog(`📍 Root: ${projectRoot}`);
    writeLog(`📄 Output: ${outputPath}`);
    writeLog(`🗜️  Compression: Level ${config.compressionLevel}`);
    writeLog(`📊 Include outputs: ${config.includeOutputs ? 'Yes' : 'No'}`);

    // Prepare exclusion patterns
    let excludePatterns = [...config.exclude];
    if (!config.includeOutputs && !excludePatterns.includes('outputs/**')) {
      excludePatterns.push('outputs/**');
    }

    writeLog(`🚫 Excluding: ${excludePatterns.join(', ')}`);

    if (config.dryRun) {
      writeLog('🧪 DRY RUN - Scanning files that would be included...');

      // Simulate what would be archived
      const glob = await import('glob');
      const files = await glob.glob('**/*', {
        cwd: projectRoot,
        ignore: excludePatterns,
        dot: true,
        nodir: true,
      });

      writeLog(`📋 Would archive ${files.length} files:`);
      files.slice(0, 20).forEach(file => writeLog(`   - ${file}`));
      if (files.length > 20) {
        writeLog(`   ... and ${files.length - 20} more files`);
      }

      // Calculate total size
      let totalSize = 0;
      for (const file of files) {
        try {
          const stats = fs.statSync(path.join(projectRoot, file));
          totalSize += stats.size;
        } catch {
          // Skip files that can't be read
        }
      }

      writeLog(`📊 Total size: ${formatBytes(totalSize)}`);
      writeLog('🧪 Dry run complete - no archive created');
      return;
    }

    // Remove existing output file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      writeLog('🗑️  Removed existing archive');
    }

    // Create archive
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: config.compressionLevel },
    });

    let fileCount = 0;

    output.on('close', () => {
      const sizeFormatted = formatBytes(archive.pointer());
      writeLog(`✅ Archive created successfully!`);
      writeLog(`📊 Size: ${sizeFormatted}`);
      writeLog(`📁 Files: ${fileCount}`);
      writeLog(`📍 Location: ${outputPath}`);

      // Create metadata file
      const metadata = {
        created: new Date().toISOString(),
        project: projectInfo,
        archive: {
          filename: config.outputName,
          size: archive.pointer(),
          sizeFormatted,
          fileCount,
          compressionLevel: config.compressionLevel,
        },
        options: {
          includeOutputs: config.includeOutputs,
          excludePatterns,
        },
      };

      const metadataPath = path.join(
        outputsDir,
        `${path.parse(config.outputName).name}-metadata.json`,
      );
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      writeLog(`📋 Metadata saved to: ${metadataPath}`);
    });

    output.on('error', err => {
      writeLog(`❌ Output stream error: ${err.message}`);
      process.exit(1);
    });

    archive.on('error', err => {
      writeLog(`❌ Archive error: ${err.message}`);
      process.exit(1);
    });

    archive.on('progress', progress => {
      if (progress.entries.processed % 100 === 0) {
        writeLog(`📁 Processed ${progress.entries.processed} files...`);
      }
    });

    archive.on('entry', entry => {
      fileCount++;
    });

    archive.pipe(output);

    writeLog('🔍 Scanning and adding files...');

    // Add files with exclusion patterns
    archive.glob('**/*', {
      cwd: projectRoot,
      ignore: excludePatterns,
      dot: true, // Include dotfiles unless excluded
    });

    await archive.finalize();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    writeLog(`❌ Error: ${errorMessage}`);
    process.exit(1);
  }
}

// Main execution
const options = parseArgs();
createProjectZip(options).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
