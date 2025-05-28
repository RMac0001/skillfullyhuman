// scripts/verify-env.ts
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

interface VerificationResult {
  tool: string;
  installed: boolean;
  version?: string;
  error?: string;
}

interface DirectoryResult {
  directory: string;
  exists: boolean;
}

function checkCommand(command: string, name: string): VerificationResult {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    const version = output.trim();
    console.log(`✅ ${name} installed: ${version}`);
    return { tool: name, installed: true, version };
  } catch (error) {
    const errorMsg = `${name} not installed or not working properly`;
    console.error(`❌ ${errorMsg}`);
    return { tool: name, installed: false, error: errorMsg };
  }
}

function checkDirectory(dir: string): DirectoryResult {
  const fullPath = path.resolve(process.cwd(), dir);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✅ Directory exists: ${dir}`);
  } else {
    console.error(`❌ Directory missing: ${dir}`);
  }

  return { directory: dir, exists };
}

function saveResults(
  toolResults: VerificationResult[],
  dirResults: DirectoryResult[],
) {
  // Create outputs directory if it doesn't exist
  const outputsDir = path.join(process.cwd(), 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const results = {
    timestamp: new Date().toISOString(),
    tools: toolResults,
    directories: dirResults,
    summary: {
      allToolsInstalled: toolResults.every(r => r.installed),
      allDirectoriesExist: dirResults.every(r => r.exists),
      missingTools: toolResults.filter(r => !r.installed).map(r => r.tool),
      missingDirectories: dirResults
        .filter(r => !r.exists)
        .map(r => r.directory),
    },
  };

  const outputPath = path.join(outputsDir, 'environment-verification.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Results saved to: ${outputPath}`);
}

function main() {
  console.log('🔍 Verifying development environment...\n');

  // Check core tools
  const toolResults: VerificationResult[] = [
    checkCommand('node --version', 'Node.js'),
    checkCommand('npm --version', 'npm'),
    checkCommand('git --version', 'Git'),
    checkCommand('tsc --version', 'TypeScript'),
    checkCommand('python --version', 'Python'),
  ];

  // Check MongoDB separately (optional tool)
  try {
    const mongoResult = checkCommand('mongod --version', 'MongoDB');
    toolResults.push(mongoResult);
  } catch (error) {
    console.error('❌ MongoDB not installed or not in PATH');
    toolResults.push({
      tool: 'MongoDB',
      installed: false,
      error: 'Not in PATH',
    });
  }

  console.log('\n📁 Checking project structure...');

  // Check required directories (updated based on your actual structure)
  const requiredDirs = [
    'app',
    'components',
    'lib',
    'types',
    'scripts',
    'public',
    // Removed "tests" since you don't have it yet
  ];

  const dirResults = requiredDirs.map(dir => checkDirectory(dir));

  // Save results to outputs directory
  saveResults(toolResults, dirResults);

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 ENVIRONMENT VERIFICATION SUMMARY');
  console.log('='.repeat(50));

  const allToolsInstalled = toolResults.every(r => r.installed);
  const allDirsExist = dirResults.every(r => r.exists);

  if (allToolsInstalled && allDirsExist) {
    console.log('🎉 Environment is fully set up and ready!');
  } else {
    console.log('⚠️  Some issues found:');

    const missingTools = toolResults.filter(r => !r.installed);
    if (missingTools.length > 0) {
      console.log(
        `   Missing tools: ${missingTools.map(r => r.tool).join(', ')}`,
      );
    }

    const missingDirs = dirResults.filter(r => !r.exists);
    if (missingDirs.length > 0) {
      console.log(
        `   Missing directories: ${missingDirs.map(r => r.directory).join(', ')}`,
      );
    }
  }
}

// Run the verification
if (require.main === module) {
  main();
}
