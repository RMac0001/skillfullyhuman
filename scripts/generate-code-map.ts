// scripts/generate-code-map.ts
// Analyzes TypeScript/JavaScript codebase and generates a comprehensive code map with API flow analysis

import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface ClassificationRule {
  match: string | RegExp;
  type: string;
  purpose?: string;
  db?: string;
  framework?: string;
  layer?: 'presentation' | 'business' | 'data' | 'infrastructure';
}

interface ApiCall {
  method: string;
  endpoint: string;
  line: number;
  context: string;
  callType: 'fetch' | 'axios' | 'next-auth' | 'custom' | 'unknown';
}

interface ApiEndpoint {
  method: string;
  path: string;
  handler: string;
  line: number;
  middleware?: string[];
  authentication?: boolean;
}

interface FileAnalysis {
  type: string;
  purpose: string;
  exports: string[];
  imports: string[];
  dependencies: string[];
  complexity: {
    lines: number;
    functions: number;
    classes: number;
    interfaces: number;
    components: number;
  };
  apiCalls?: ApiCall[];
  apiEndpoints?: ApiEndpoint[];
  db?: string;
  framework?: string;
  layer?: string;
  isApiRoute?: boolean;
  isPageComponent?: boolean;
  hasTests?: boolean;
}

interface CodeMapOptions {
  outputFileName?: string;
  includeNodeModules?: boolean;
  analyzeComplexity?: boolean;
  generateReport?: boolean;
}

// Enhanced classification rules based on your project structure
const defaultRules: ClassificationRule[] = [
  // Database models
  {
    match: /lib\/db\/models\/mongo/,
    type: 'model',
    db: 'mongodb',
    layer: 'data',
    purpose: 'MongoDB data model',
  },
  {
    match: /lib\/db\/models\/chroma/,
    type: 'model',
    db: 'chroma',
    layer: 'data',
    purpose: 'ChromaDB vector model',
  },
  {
    match: /lib\/db/,
    type: 'database',
    layer: 'data',
    purpose: 'Database connection/utility',
  },

  // Next.js App Router structure
  {
    match: /app\/.*\/page\.tsx?$/,
    type: 'page',
    framework: 'next.js',
    layer: 'presentation',
    purpose: 'Next.js page component',
  },
  {
    match: /app\/.*\/layout\.tsx?$/,
    type: 'layout',
    framework: 'next.js',
    layer: 'presentation',
    purpose: 'Next.js layout component',
  },
  {
    match: /app\/.*\/loading\.tsx?$/,
    type: 'loading',
    framework: 'next.js',
    layer: 'presentation',
    purpose: 'Next.js loading component',
  },
  {
    match: /app\/.*\/error\.tsx?$/,
    type: 'error',
    framework: 'next.js',
    layer: 'presentation',
    purpose: 'Next.js error component',
  },
  {
    match: /app\/.*\/not-found\.tsx?$/,
    type: 'not-found',
    framework: 'next.js',
    layer: 'presentation',
    purpose: 'Next.js 404 component',
  },
  {
    match: /app\/api\/.*\/route\.tsx?$/,
    type: 'api-route',
    framework: 'next.js',
    layer: 'business',
    purpose: 'Next.js API route handler',
  },

  // Components
  {
    match: /components\/ui/,
    type: 'ui-component',
    framework: 'react',
    layer: 'presentation',
    purpose: 'Reusable UI component',
  },
  {
    match: /components\/layout/,
    type: 'layout-component',
    framework: 'react',
    layer: 'presentation',
    purpose: 'Layout component',
  },
  {
    match: /components/,
    type: 'component',
    framework: 'react',
    layer: 'presentation',
    purpose: 'React component',
  },

  // CMS
  {
    match: /cms/,
    type: 'cms',
    layer: 'presentation',
    purpose: 'Content management system component',
  },

  // Types and interfaces
  {
    match: /types/,
    type: 'type-definition',
    layer: 'infrastructure',
    purpose: 'TypeScript type definitions',
  },

  // Library code
  {
    match: /lib\/auth/,
    type: 'auth',
    layer: 'infrastructure',
    purpose: 'Authentication utilities',
  },
  {
    match: /lib/,
    type: 'utility',
    layer: 'infrastructure',
    purpose: 'Utility library',
  },

  // Configuration
  {
    match: /middleware\.ts/,
    type: 'middleware',
    framework: 'next.js',
    layer: 'infrastructure',
    purpose: 'Next.js middleware',
  },
  {
    match: /next\.config/,
    type: 'config',
    framework: 'next.js',
    layer: 'infrastructure',
    purpose: 'Next.js configuration',
  },
  {
    match: /\.config\.(ts|js)/,
    type: 'config',
    layer: 'infrastructure',
    purpose: 'Configuration file',
  },

  // Scripts and tools
  {
    match: /scripts/,
    type: 'script',
    layer: 'infrastructure',
    purpose: 'Development/build script',
  },
  {
    match: /dev-utils/,
    type: 'dev-tool',
    layer: 'infrastructure',
    purpose: 'Development utility',
  },

  // Tests
  {
    match: /\.test\.(ts|tsx|js|jsx)/,
    type: 'test',
    layer: 'infrastructure',
    purpose: 'Unit test',
  },
  {
    match: /\.spec\.(ts|tsx|js|jsx)/,
    type: 'test',
    layer: 'infrastructure',
    purpose: 'Specification test',
  },
  {
    match: /__tests__/,
    type: 'test',
    layer: 'infrastructure',
    purpose: 'Test file',
  },
];

function parseArgs(): CodeMapOptions {
  const args = process.argv.slice(2);
  const options: CodeMapOptions = {
    outputFileName: 'code-map.json',
    includeNodeModules: false,
    analyzeComplexity: true,
    generateReport: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output' && i + 1 < args.length) {
      options.outputFileName = args[i + 1];
      i++;
    } else if (arg === '--include-node-modules') {
      options.includeNodeModules = true;
    } else if (arg === '--no-complexity') {
      options.analyzeComplexity = false;
    } else if (arg === '--no-report') {
      options.generateReport = false;
    } else if (arg === '--help') {
      showHelp();
      process.exit(0);
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
🗺️  Code Map Generator

Usage: npx tsx scripts/generate-code-map.ts [options]

Options:
  --output <filename>      Output filename (default: code-map.json)
  --include-node-modules   Include node_modules analysis
  --no-complexity         Skip complexity analysis  
  --no-report             Skip generating summary report
  --help                  Show this help message

Examples:
  npx tsx scripts/generate-code-map.ts
  npx tsx scripts/generate-code-map.ts --output detailed-map.json
  npx tsx scripts/generate-code-map.ts --include-node-modules --no-complexity
`);
}

function classifyFile(
  filePath: string,
  rules: ClassificationRule[],
): Partial<FileAnalysis> {
  for (const rule of rules) {
    const matches =
      typeof rule.match === 'string'
        ? filePath.includes(rule.match)
        : rule.match.test(filePath);

    if (matches) {
      return {
        type: rule.type,
        purpose: rule.purpose || `Inferred as ${rule.type} from path`,
        db: rule.db,
        framework: rule.framework,
        layer: rule.layer,
        isApiRoute: rule.type === 'api-route',
        isPageComponent: rule.type === 'page',
      };
    }
  }

  return {
    type: 'unknown',
    purpose: 'Could not infer purpose from path',
  };
}

function analyzeApiCalls(sourceFile: SourceFile): ApiCall[] {
  const apiCalls: ApiCall[] = [];
  const text = sourceFile.getFullText();
  const lines = text.split('\n');

  // Patterns to detect API calls
  const patterns = [
    // fetch calls
    {
      regex:
        /fetch\s*\(\s*['"`]([^'"`]+)['"`](?:\s*,\s*\{[^}]*method\s*:\s*['"`]([^'"`]+)['"`])?/gi,
      callType: 'fetch' as const,
    },
    // fetch with template literals
    {
      regex:
        /fetch\s*\(\s*`([^`]+)`(?:\s*,\s*\{[^}]*method\s*:\s*['"`]([^'"`]+)['"`])?/gi,
      callType: 'fetch' as const,
    },
    // axios calls
    {
      regex: /axios\.([a-z]+)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
      callType: 'axios' as const,
    },
    // axios generic
    {
      regex:
        /axios\s*\(\s*\{[^}]*url\s*:\s*['"`]([^'"`]+)['"`][^}]*method\s*:\s*['"`]([^'"`]+)['"`]/gi,
      callType: 'axios' as const,
    },
    // Next.js router.push for client-side navigation
    {
      regex: /router\.push\s*\(\s*['"`]([^'"`]+)['"`]/gi,
      callType: 'next-auth' as const,
    },
  ];

  patterns.forEach(({ regex, callType }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const endpoint = match[1] || match[2];
      let method = match[2] || match[1];

      // For axios, the method might be in the function name
      if (callType === 'axios' && !method) {
        const axiosMethodMatch = fullMatch.match(/axios\.([a-z]+)/);
        method = axiosMethodMatch ? axiosMethodMatch[1].toUpperCase() : 'GET';
      } else if (!method) {
        method = 'GET'; // default
      }

      // Find line number
      const beforeMatch = text.substring(0, match.index!);
      const lineNumber = beforeMatch.split('\n').length;

      // Get context (the line with some surrounding context)
      const contextStart = Math.max(0, lineNumber - 2);
      const contextEnd = Math.min(lines.length, lineNumber + 1);
      const context = lines.slice(contextStart, contextEnd).join('\n').trim();

      apiCalls.push({
        method: method.toUpperCase(),
        endpoint,
        line: lineNumber,
        context,
        callType,
      });
    }
  });

  return apiCalls;
}

function analyzeApiEndpoints(
  sourceFile: SourceFile,
  filePath: string,
): ApiEndpoint[] {
  const apiEndpoints: ApiEndpoint[] = [];

  // Only analyze API route files
  if (!filePath.includes('app/api/') || !filePath.endsWith('route.ts')) {
    return apiEndpoints;
  }

  const text = sourceFile.getFullText();

  // Extract route path from file path
  const routePath =
    filePath
      .replace(/^app\/api/, '')
      .replace(/\/route\.ts$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1') || // Convert [id] to :id
    '/';

  // Find HTTP method exports (GET, POST, PUT, DELETE, etc.)
  const httpMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS',
  ];

  httpMethods.forEach(method => {
    const regex = new RegExp(
      `export\\s+(?:async\\s+)?function\\s+${method}\\s*\\(`,
      'gi',
    );
    const match = regex.exec(text);

    if (match) {
      const beforeMatch = text.substring(0, match.index!);
      const lineNumber = beforeMatch.split('\n').length;

      // Look for middleware or authentication patterns
      const functionText = extractFunctionBody(text, match.index!);
      const hasAuth = /auth|session|token|bearer/i.test(functionText);
      const middleware = extractMiddleware(functionText);

      apiEndpoints.push({
        method,
        path: routePath,
        handler: `${method} handler`,
        line: lineNumber,
        middleware,
        authentication: hasAuth,
      });
    }
  });

  return apiEndpoints;
}

function extractFunctionBody(text: string, startIndex: number): string {
  let braceCount = 0;
  let inFunction = false;
  let functionBody = '';

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (char === '{') {
      braceCount++;
      inFunction = true;
    } else if (char === '}') {
      braceCount--;
    }

    if (inFunction) {
      functionBody += char;
    }

    if (inFunction && braceCount === 0) {
      break;
    }
  }

  return functionBody;
}

function extractMiddleware(functionText: string): string[] {
  const middleware: string[] = [];

  // Common middleware patterns
  const patterns = [
    /cors\(/gi,
    /rateLimit\(/gi,
    /authenticate\(/gi,
    /authorize\(/gi,
    /validate\(/gi,
    /morgan\(/gi,
    /helmet\(/gi,
  ];

  patterns.forEach(pattern => {
    if (pattern.test(functionText)) {
      const match = functionText.match(pattern);
      if (match) {
        middleware.push(match[0].replace('(', ''));
      }
    }
  });

  return middleware;
}

function analyzeSourceFile(
  sourceFile: SourceFile,
  filePath: string,
  analyzeComplexity: boolean,
): Partial<FileAnalysis> {
  const analysis: Partial<FileAnalysis> = {
    exports: [],
    imports: [],
    dependencies: [],
    complexity: {
      lines: 0,
      functions: 0,
      classes: 0,
      interfaces: 0,
      components: 0,
    },
    apiCalls: [],
    apiEndpoints: [],
  };

  try {
    // Get exports
    analysis.exports = sourceFile
      .getExportSymbols()
      .map(symbol => symbol.getName());

    // Get imports
    const imports = sourceFile.getImportDeclarations();
    analysis.imports = imports.map(imp => imp.getModuleSpecifierValue());
    analysis.dependencies = analysis.imports.filter(
      imp => !imp.startsWith('.') && !imp.startsWith('/'),
    );

    // Analyze API calls and endpoints
    analysis.apiCalls = analyzeApiCalls(sourceFile);
    analysis.apiEndpoints = analyzeApiEndpoints(sourceFile, filePath);

    if (analyzeComplexity) {
      // Calculate complexity metrics
      analysis.complexity = {
        lines: sourceFile.getFullText().split('\n').length,
        functions:
          sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
            .length +
          sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction).length +
          sourceFile.getDescendantsOfKind(SyntaxKind.FunctionExpression).length,
        classes: sourceFile.getDescendantsOfKind(SyntaxKind.ClassDeclaration)
          .length,
        interfaces: sourceFile.getDescendantsOfKind(
          SyntaxKind.InterfaceDeclaration,
        ).length,
        components: 0, // Will be calculated below
      };

      // Detect React components (functions that return JSX)
      const functionDeclarations = sourceFile.getDescendantsOfKind(
        SyntaxKind.FunctionDeclaration,
      );
      const arrowFunctions = sourceFile.getDescendantsOfKind(
        SyntaxKind.ArrowFunction,
      );

      analysis.complexity.components = [
        ...functionDeclarations,
        ...arrowFunctions,
      ].filter(func => {
        const returnType = func.getReturnTypeNode();
        const body = func.getBody();
        return (
          returnType?.getText().includes('JSX') ||
          body?.getText().includes('return (') ||
          body?.getText().includes('<')
        );
      }).length;
    }

    // Check if has test files
    const testFiles = [
      filePath.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1'),
      filePath.replace(/\.(ts|tsx|js|jsx)$/, '.spec.$1'),
      path.join(path.dirname(filePath), '__tests__', path.basename(filePath)),
    ];

    analysis.hasTests = testFiles.some(testFile =>
      fs.existsSync(path.join(projectRoot, testFile)),
    );
  } catch (error) {
    console.warn(
      `Warning: Could not fully analyze ${filePath}:`,
      error instanceof Error ? error.message : error,
    );
  }

  return analysis;
}

function matchesPathPattern(
  callEndpoint: string,
  endpointPath: string,
): boolean {
  // Convert Next.js dynamic routes to regex patterns
  const pattern = endpointPath
    .replace(/:[^/]+/g, '[^/]+') // Convert :param to regex
    .replace(/\[\.\.\.([^\]]+)\]/g, '.*') // Convert [...param] to regex
    .replace(/\[([^\]]+)\]/g, '[^/]+'); // Convert [param] to regex

  const regex = new RegExp(`^${pattern}$`);
  return regex.test(callEndpoint);
}

function generateSummaryReport(fileMap: Record<string, FileAnalysis>): any {
  const files = Object.entries(fileMap);

  // Collect all API calls and endpoints
  const allApiCalls: Array<{ file: string; call: ApiCall }> = [];
  const allApiEndpoints: Array<{ file: string; endpoint: ApiEndpoint }> = [];

  files.forEach(([filePath, analysis]) => {
    analysis.apiCalls?.forEach(call => {
      allApiCalls.push({ file: filePath, call });
    });
    analysis.apiEndpoints?.forEach(endpoint => {
      allApiEndpoints.push({ file: filePath, endpoint });
    });
  });

  // Create API flow mapping
  const apiFlowMap: Record<string, any> = {};

  allApiEndpoints.forEach(({ file, endpoint }) => {
    const key = `${endpoint.method} ${endpoint.path}`;
    if (!apiFlowMap[key]) {
      apiFlowMap[key] = {
        endpoint: {
          file,
          method: endpoint.method,
          path: endpoint.path,
          line: endpoint.line,
          authentication: endpoint.authentication,
          middleware: endpoint.middleware,
        },
        callers: [],
      };
    }
  });

  // Match API calls to endpoints
  allApiCalls.forEach(({ file, call }) => {
    // Try to match endpoint patterns
    Object.keys(apiFlowMap).forEach(endpointKey => {
      const endpoint = apiFlowMap[endpointKey].endpoint;
      const callMatches =
        call.method === endpoint.method &&
        (call.endpoint === endpoint.path ||
          call.endpoint.includes(endpoint.path) ||
          matchesPathPattern(call.endpoint, endpoint.path));

      if (callMatches) {
        apiFlowMap[endpointKey].callers.push({
          file,
          line: call.line,
          callType: call.callType,
          context: call.context.slice(0, 100) + '...', // Truncate for readability
        });
      }
    });
  });

  const summary = {
    overview: {
      totalFiles: files.length,
      byType: {} as Record<string, number>,
      byLayer: {} as Record<string, number>,
      byFramework: {} as Record<string, number>,
      withTests: files.filter(([_, analysis]) => analysis.hasTests).length,
    },
    complexity: {
      totalLines: 0,
      totalFunctions: 0,
      totalClasses: 0,
      totalInterfaces: 0,
      totalComponents: 0,
      averageComplexity: 0,
    },
    dependencies: {
      external: [] as string[],
      mostUsed: {} as Record<string, number>,
    },
    architecture: {
      apiRoutes: files.filter(([_, analysis]) => analysis.isApiRoute).length,
      pageComponents: files.filter(([_, analysis]) => analysis.isPageComponent)
        .length,
      layers: {} as Record<string, string[]>,
    },
    apiAnalysis: {
      totalApiCalls: allApiCalls.length,
      totalEndpoints: allApiEndpoints.length,
      callsByMethod: {} as Record<string, number>,
      endpointsByMethod: {} as Record<string, number>,
      callsByType: {} as Record<string, number>,
      flowMap: apiFlowMap,
      unmatchedCalls: [] as Array<{ file: string; call: ApiCall }>,
    },
  };

  // Track external dependencies across all files
  const externalDeps = new Set<string>();

  files.forEach(([filePath, analysis]) => {
    // Count by type
    summary.overview.byType[analysis.type] =
      (summary.overview.byType[analysis.type] || 0) + 1;

    // Count by layer
    if (analysis.layer) {
      summary.overview.byLayer[analysis.layer] =
        (summary.overview.byLayer[analysis.layer] || 0) + 1;
    }

    // Count by framework
    if (analysis.framework) {
      summary.overview.byFramework[analysis.framework] =
        (summary.overview.byFramework[analysis.framework] || 0) + 1;
    }

    // Complexity metrics
    if (analysis.complexity) {
      summary.complexity.totalLines += analysis.complexity.lines;
      summary.complexity.totalFunctions += analysis.complexity.functions;
      summary.complexity.totalClasses += analysis.complexity.classes;
      summary.complexity.totalInterfaces += analysis.complexity.interfaces;
      summary.complexity.totalComponents += analysis.complexity.components;
    }

    // Dependencies
    analysis.dependencies.forEach(dep => {
      externalDeps.add(dep);
      summary.dependencies.mostUsed[dep] =
        (summary.dependencies.mostUsed[dep] || 0) + 1;
    });

    // Architecture layers
    if (analysis.layer) {
      if (!summary.architecture.layers[analysis.layer]) {
        summary.architecture.layers[analysis.layer] = [];
      }
      summary.architecture.layers[analysis.layer].push(filePath);
    }

    // API analysis
    analysis.apiCalls?.forEach(call => {
      summary.apiAnalysis.callsByMethod[call.method] =
        (summary.apiAnalysis.callsByMethod[call.method] || 0) + 1;
      summary.apiAnalysis.callsByType[call.callType] =
        (summary.apiAnalysis.callsByType[call.callType] || 0) + 1;
    });

    analysis.apiEndpoints?.forEach(endpoint => {
      summary.apiAnalysis.endpointsByMethod[endpoint.method] =
        (summary.apiAnalysis.endpointsByMethod[endpoint.method] || 0) + 1;
    });
  });

  // Find unmatched API calls
  allApiCalls.forEach(({ file, call }) => {
    const isMatched = Object.values(apiFlowMap).some((flow: any) =>
      flow.callers.some(
        (caller: any) => caller.file === file && caller.line === call.line,
      ),
    );

    if (!isMatched) {
      summary.apiAnalysis.unmatchedCalls.push({ file, call });
    }
  });

  summary.complexity.averageComplexity =
    summary.complexity.totalLines / files.length;
  summary.dependencies.external = Array.from(externalDeps);

  return summary;
}

async function generateCodeMap(options: CodeMapOptions = {}): Promise<void> {
  const config = { ...parseArgs(), ...options };

  // Ensure outputs directory exists
  const outputsDir = path.join(projectRoot, 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const outputPath = path.join(outputsDir, config.outputFileName!);
  const logFile = path.join(outputsDir, 'code-map-generation.log');

  function writeLog(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(message);
    fs.appendFileSync(logFile, logEntry + '\n');
  }

  try {
    writeLog('🗺️  Generating code map...');
    writeLog(`📍 Project root: ${projectRoot}`);
    writeLog(`📄 Output: ${outputPath}`);

    // Find all TypeScript/JavaScript files
    const ignorePatterns = [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'build/**',
    ];
    if (!config.includeNodeModules) {
      ignorePatterns.push('node_modules/**');
    }

    const files = await glob('**/*.{ts,tsx,js,jsx}', {
      cwd: projectRoot,
      ignore: ignorePatterns,
    });

    writeLog(`🔍 Found ${files.length} files to analyze`);

    const project = new Project({
      tsConfigFilePath: path.join(projectRoot, 'tsconfig.json'),
      skipLoadingLibFiles: true,
    });

    const fileMap: Record<string, FileAnalysis> = {};
    let processedCount = 0;

    for (const fileRelPath of files) {
      try {
        const absPath = path.join(projectRoot, fileRelPath);

        // Classify file
        const classification = classifyFile(fileRelPath, defaultRules);

        // Add source file to project for analysis
        const sourceFile = project.addSourceFileAtPath(absPath);
        const analysis = analyzeSourceFile(
          sourceFile,
          fileRelPath,
          config.analyzeComplexity!,
        );

        // Combine classification and analysis
        fileMap[fileRelPath] = {
          ...classification,
          ...analysis,
        } as FileAnalysis;

        processedCount++;
        if (processedCount % 50 === 0) {
          writeLog(`📊 Processed ${processedCount}/${files.length} files...`);
        }
      } catch (error) {
        writeLog(
          `⚠️  Could not analyze ${fileRelPath}: ${error instanceof Error ? error.message : error}`,
        );

        // Still add basic classification
        fileMap[fileRelPath] = {
          ...classifyFile(fileRelPath, defaultRules),
          exports: [],
          imports: [],
          dependencies: [],
          complexity: {
            lines: 0,
            functions: 0,
            classes: 0,
            interfaces: 0,
            components: 0,
          },
          apiCalls: [],
          apiEndpoints: [],
        } as FileAnalysis;
      }
    }

    // Generate summary report
    let summary = {};
    if (config.generateReport) {
      writeLog('📋 Generating summary report...');
      summary = generateSummaryReport(fileMap);
    }

    // Prepare final output
    const output = {
      metadata: {
        generated: new Date().toISOString(),
        projectRoot,
        totalFiles: Object.keys(fileMap).length,
        options: config,
      },
      summary,
      files: fileMap,
    };

    // Write output
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    writeLog(`✅ Code map generated successfully!`);
    writeLog(`📊 Analyzed ${Object.keys(fileMap).length} files`);
    writeLog(`📁 Output saved to: ${outputPath}`);

    if (config.generateReport) {
      const reportPath = path.join(outputsDir, 'code-map-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
      writeLog(`📋 Summary report: ${reportPath}`);

      // Log some key stats
      const stats = summary as any;
      writeLog('\n📈 Key Statistics:');
      writeLog(`   Total files: ${stats.overview.totalFiles}`);
      writeLog(`   API routes: ${stats.architecture.apiRoutes}`);
      writeLog(`   Page components: ${stats.architecture.pageComponents}`);
      writeLog(`   Files with tests: ${stats.overview.withTests}`);
      writeLog(`   API calls: ${stats.apiAnalysis.totalApiCalls}`);
      writeLog(`   API endpoints: ${stats.apiAnalysis.totalEndpoints}`);
      writeLog(
        `   Matched API flows: ${Object.keys(stats.apiAnalysis.flowMap).length}`,
      );
      writeLog(
        `   Unmatched calls: ${stats.apiAnalysis.unmatchedCalls.length}`,
      );
      writeLog(`   Total lines of code: ${stats.complexity.totalLines}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    writeLog(`❌ Error: ${errorMessage}`);
    process.exit(1);
  }
}

// Main execution
generateCodeMap().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
