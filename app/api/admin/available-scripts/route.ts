// app/api/admin/available-scripts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

// Define types for script objects
interface ScriptItem {
  id: string;
  name: string;
  description: string;
  arguments?: string[];
  type: string;
  path: string;
  size: number;
  lastModified: Date;
}

interface ScriptsResponse {
  scripts: ScriptItem[];
  tests: ScriptItem[];
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const scriptsDir = path.join(process.cwd(), 'scripts');
    const testsDir = path.join(process.cwd(), 'tests');

    // Get script files
    const scripts: ScriptItem[] = [];
    if (fs.existsSync(scriptsDir)) {
      const scriptFiles = fs.readdirSync(scriptsDir);

      for (const file of scriptFiles) {
        // Filter for JavaScript, TypeScript and PowerShell scripts
        if (
          file.endsWith('.js') ||
          file.endsWith('.ts') ||
          file.endsWith('.ps1')
        ) {
          const filePath = path.join(scriptsDir, file);
          const fileStats = fs.statSync(filePath);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Simple metadata extraction (assuming metadata is in comments at the top)
          const descriptionMatch = fileContent.match(
            /\/\/\s*Description:\s*(.+)/,
          );
          const argsMatch = fileContent.match(/\/\/\s*Args:\s*(.+)/);

          // Determine script type based on extension
          let type = 'Unknown';
          if (file.endsWith('.js')) type = 'JavaScript';
          else if (file.endsWith('.ts')) type = 'TypeScript';
          else if (file.endsWith('.ps1')) type = 'PowerShell';

          scripts.push({
            id: file,
            name: file.replace(/\.[^/.]+$/, ''), // Remove extension
            description: descriptionMatch
              ? descriptionMatch[1]
              : 'No description available',
            arguments: argsMatch
              ? argsMatch[1].split(',').map(arg => arg.trim())
              : undefined,
            type,
            path: filePath,
            size: fileStats.size,
            lastModified: fileStats.mtime,
          });
        }
      }
    }

    // Get test files
    const tests: ScriptItem[] = [];
    if (fs.existsSync(testsDir)) {
      const testFiles = fs.readdirSync(testsDir);

      for (const file of testFiles) {
        // Filter for test files
        if (
          file.endsWith('.js') ||
          file.endsWith('.ts') ||
          file.endsWith('.ps1') ||
          file.endsWith('.test.js') ||
          file.endsWith('.test.ts')
        ) {
          const filePath = path.join(testsDir, file);
          const fileStats = fs.statSync(filePath);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Simple metadata extraction
          const descriptionMatch = fileContent.match(
            /\/\/\s*Description:\s*(.+)/,
          );

          // Determine test type based on extension
          let type = 'Unknown';
          if (file.endsWith('.js') || file.endsWith('.test.js'))
            type = 'JavaScript';
          else if (file.endsWith('.ts') || file.endsWith('.test.ts'))
            type = 'TypeScript';
          else if (file.endsWith('.ps1')) type = 'PowerShell';

          tests.push({
            id: file,
            name: file.replace(/\.[^/.]+$/, ''), // Remove extension
            description: descriptionMatch
              ? descriptionMatch[1]
              : 'No description available',
            type,
            path: filePath,
            size: fileStats.size,
            lastModified: fileStats.mtime,
          });
        }
      }
    }

    return NextResponse.json({ scripts, tests });
  } catch (error) {
    console.error('Error in available-scripts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available scripts' },
      { status: 500 },
    );
  }
}
