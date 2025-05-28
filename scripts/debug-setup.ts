// scripts/debug-setup.ts
// Diagnostic Script - Run this to check your setup and identify issues

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get project root directory (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputsDir = path.join(projectRoot, 'outputs');

// Ensure outputs directory exists
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

const logFile = path.join(outputsDir, 'debug-setup.log');
const reportFile = path.join(outputsDir, 'setup-diagnosis.json');

interface DiagnosisResult {
  timestamp: string;
  files: Record<string, boolean>;
  dependencies: Record<string, string | null>;
  cssImports: string[];
  recommendations: string[];
  summary: {
    allFilesExist: boolean;
    allDepsInstalled: boolean;
    cssImportsFound: boolean;
    overallHealth: 'healthy' | 'issues' | 'critical';
  };
}

function writeLog(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}`;

  console.log(message);
  fs.appendFileSync(logFile, logEntry + '\n');
}

function checkFileExists(filePath: string): boolean {
  const fullPath = path.join(projectRoot, filePath);
  return fs.existsSync(fullPath);
}

function checkRequiredFiles(): Record<string, boolean> {
  writeLog('\n1. 📁 Checking required files:');

  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'app/layout.tsx',
    'theme.ts',
    'app/providers.tsx',
    '.env.template',
    'middleware.ts',
  ];

  const results: Record<string, boolean> = {};

  requiredFiles.forEach(file => {
    const exists = checkFileExists(file);
    results[file] = exists;
    writeLog(`   ${exists ? '✅' : '❌'} ${file}`);
  });

  return results;
}

function checkDependencies(): Record<string, string | null> {
  writeLog('\n2. 📦 Checking dependencies:');

  const results: Record<string, string | null> = {};

  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = Object.assign(
      {},
      packageJson.dependencies || {},
      packageJson.devDependencies || {},
    );

    const requiredDeps = [
      '@mantine/core',
      '@mantine/hooks',
      '@tabler/icons-react',
      'next',
      'react',
      'react-dom',
      'typescript',
      '@types/node',
      '@types/react',
      'mongodb',
      'next-auth',
    ];

    requiredDeps.forEach(dep => {
      const version = deps[dep] || null;
      results[dep] = version;
      writeLog(`   ${version ? '✅' : '❌'} ${dep}: ${version || 'Missing'}`);
    });
  } catch (error) {
    writeLog('   ❌ Could not read package.json');
    results['package.json'] = null;
  }

  return results;
}

function checkForCSSImports(): string[] {
  writeLog('\n3. 🎨 Checking for CSS import issues:');

  const cssImports: string[] = [];

  const checkDirectory = (dir: string): string[] => {
    const fullDir = path.join(projectRoot, dir);
    if (!fs.existsSync(fullDir)) return [];

    const files = fs.readdirSync(fullDir, { withFileTypes: true });
    const imports: string[] = [];

    files.forEach(file => {
      if (file.isDirectory()) {
        imports.push(...checkDirectory(path.join(dir, file.name)));
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        try {
          const content = fs.readFileSync(
            path.join(fullDir, file.name),
            'utf8',
          );
          if (content.includes('@mantine/core/styles')) {
            const relativePath = path.join(dir, file.name);
            imports.push(relativePath);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    });

    return imports;
  };

  const appImports = checkDirectory('app');
  const componentImports = checkDirectory('components');

  cssImports.push(...appImports, ...componentImports);

  if (cssImports.length > 0) {
    writeLog('   Found CSS imports in:');
    cssImports.forEach(file => writeLog(`   - ${file}`));

    if (cssImports.length > 1) {
      writeLog(
        '   ⚠️  Multiple CSS imports detected - this may cause conflicts',
      );
    }
  } else {
    writeLog('   ❌ No @mantine/core/styles imports found');
  }

  return cssImports;
}

function checkEnvironmentFiles(): Record<string, boolean> {
  writeLog('\n4. 🔧 Checking environment configuration:');

  const envFiles = ['.env', '.env.local', '.env.template'];
  const results: Record<string, boolean> = {};

  envFiles.forEach(file => {
    const exists = checkFileExists(file);
    results[file] = exists;
    writeLog(`   ${exists ? '✅' : '❌'} ${file}`);
  });

  return results;
}

function generateRecommendations(
  files: Record<string, boolean>,
  deps: Record<string, string | null>,
  cssImports: string[],
): string[] {
  const recommendations: string[] = [];

  // File recommendations
  Object.entries(files).forEach(([file, exists]) => {
    if (!exists) {
      if (file === 'app/providers.tsx') {
        recommendations.push(
          'Create app/providers.tsx with MantineProvider setup',
        );
      } else if (file === 'theme.ts') {
        recommendations.push('Create theme.ts for Mantine theme configuration');
      } else {
        recommendations.push(`Create missing file: ${file}`);
      }
    }
  });

  // Dependency recommendations
  Object.entries(deps).forEach(([dep, version]) => {
    if (!version) {
      recommendations.push(`Install missing dependency: npm install ${dep}`);
    }
  });

  // CSS import recommendations
  if (cssImports.length === 0) {
    recommendations.push(
      'Add @mantine/core/styles.css import to app/providers.tsx',
    );
  } else if (cssImports.length > 1) {
    recommendations.push(
      'Remove duplicate @mantine/core/styles imports - keep only one in providers.tsx',
    );
  }

  // Only add general recommendations if there are actual issues
  const hasIssues =
    Object.values(files).some(exists => !exists) ||
    Object.values(deps).some(version => !version) ||
    cssImports.length !== 1;

  if (hasIssues) {
    recommendations.push('Clear Next.js cache: rm -rf .next');
    recommendations.push(
      'Reinstall node_modules if issues persist: rm -rf node_modules && npm install',
    );
  }

  // If everything is perfect, add a positive message
  if (recommendations.length === 0) {
    recommendations.push('🎉 Setup looks perfect! No issues detected.');
  }

  return recommendations;
}

function calculateOverallHealth(
  files: Record<string, boolean>,
  deps: Record<string, string | null>,
  cssImports: string[],
): 'healthy' | 'issues' | 'critical' {
  const missingFiles = Object.values(files).filter(exists => !exists).length;
  const missingDeps = Object.values(deps).filter(version => !version).length;
  const cssIssues = cssImports.length !== 1;

  if (missingFiles === 0 && missingDeps === 0 && !cssIssues) {
    return 'healthy';
  } else if (missingFiles <= 2 && missingDeps <= 2) {
    return 'issues';
  } else {
    return 'critical';
  }
}

async function runDiagnosis(): Promise<void> {
  const startTime = new Date().toISOString();

  console.log('🔍 Diagnosing Next.js + Mantine Setup...');
  console.log(`📍 Project root: ${projectRoot}`);
  console.log(`📊 Reports will be saved to: ${outputsDir}`);

  try {
    // Run all checks
    const files = checkRequiredFiles();
    const deps = checkDependencies();
    const cssImports = checkForCSSImports();
    checkEnvironmentFiles(); // For logging only

    // Generate recommendations
    const recommendations = generateRecommendations(files, deps, cssImports);

    writeLog('\n5. 💡 Recommendations:');
    recommendations.forEach(rec => writeLog(`   - ${rec}`));

    // Create diagnosis result
    const result: DiagnosisResult = {
      timestamp: startTime,
      files,
      dependencies: deps,
      cssImports,
      recommendations,
      summary: {
        allFilesExist: Object.values(files).every(exists => exists),
        allDepsInstalled: Object.values(deps).every(
          version => version !== null,
        ),
        cssImportsFound: cssImports.length > 0,
        overallHealth: calculateOverallHealth(files, deps, cssImports),
      },
    };

    // Save detailed report
    fs.writeFileSync(reportFile, JSON.stringify(result, null, 2));

    // Final summary
    writeLog('\n📋 DIAGNOSIS SUMMARY');
    writeLog('='.repeat(40));
    writeLog(`Overall Health: ${result.summary.overallHealth.toUpperCase()}`);
    writeLog(
      `Files Status: ${result.summary.allFilesExist ? 'All present' : 'Some missing'}`,
    );
    writeLog(
      `Dependencies: ${result.summary.allDepsInstalled ? 'All installed' : 'Some missing'}`,
    );
    writeLog(
      `CSS Imports: ${result.summary.cssImportsFound ? 'Found' : 'Missing'}`,
    );
    writeLog(`Recommendations: ${recommendations.length} items`);
    writeLog(`Detailed report: ${reportFile}`);

    writeLog('\n✨ Diagnosis complete!');

    // Exit with appropriate code
    process.exit(result.summary.overallHealth === 'critical' ? 1 : 0);
  } catch (error) {
    writeLog(`💥 Error during diagnosis: ${error}`);
    process.exit(1);
  }
}

// Run the diagnosis
runDiagnosis().catch(error => {
  console.error('Unhandled error in runDiagnosis:', error);
  process.exit(1);
});
