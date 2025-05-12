// app/admin/scripts/ScriptsClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define types for scripts and tests
interface ScriptItem {
  id: string;
  name: string;
  description: string;
  type: string;
  path: string;
  arguments?: string[];
  size: number;
  lastModified: string;
}

interface ScriptsResponse {
  scripts: ScriptItem[];
  tests: ScriptItem[];
}

interface ScriptRunResponse {
  output: string;
}

export default function ScriptsClient() {
  const { data: session } = useSession();
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [tests, setTests] = useState<ScriptItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const [scriptOutput, setScriptOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch('/api/admin/available-scripts');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: ScriptsResponse = await response.json();
        setScripts(data.scripts || []);
        setTests(data.tests || []);
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to fetch scripts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchScripts();
    }
  }, [session]);

  const handleScriptSelect = (script: ScriptItem) => {
    setSelectedScript(script);
    setScriptOutput('');
  };

  const handleRunScript = async () => {
    if (!selectedScript) return;

    setIsRunning(true);
    setScriptOutput('Running script...');

    try {
      const response = await fetch('/api/admin/run-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: selectedScript.id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ScriptRunResponse = await response.json();
      setScriptOutput(data.output || 'Script completed successfully.');
    } catch (err) {
      setScriptOutput(`Error: ${(err as Error).message}`);
      console.error('Failed to run script:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Scripts & Tests
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Run maintenance scripts and tests
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        <div className="mt-4 border-l-4 border-red-400 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Script List */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Available Scripts
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Maintenance and utility scripts
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
                  {scripts.length === 0 ? (
                    <li className="px-4 py-4 text-sm text-gray-500">
                      No scripts available
                    </li>
                  ) : (
                    scripts.map(script => (
                      <li
                        key={script.id}
                        onClick={() => handleScriptSelect(script)}
                        className={`cursor-pointer px-4 py-4 hover:bg-gray-50 ${
                          selectedScript?.id === script.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {script.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {script.description}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {script.type}
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Available Tests
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  System and integration tests
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
                  {tests.length === 0 ? (
                    <li className="px-4 py-4 text-sm text-gray-500">
                      No tests available
                    </li>
                  ) : (
                    tests.map(test => (
                      <li
                        key={test.id}
                        onClick={() => handleScriptSelect(test)}
                        className={`cursor-pointer px-4 py-4 hover:bg-gray-50 ${
                          selectedScript?.id === test.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {test.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {test.description}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {test.type}
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Script Details and Console */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
              <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedScript
                      ? selectedScript.name
                      : 'Select a script or test'}
                  </h3>
                  {selectedScript && (
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {selectedScript.description}
                    </p>
                  )}
                </div>
                {selectedScript && (
                  <button
                    onClick={handleRunScript}
                    disabled={isRunning}
                    className={`inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                      isRunning ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <svg
                          className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Running...
                      </>
                    ) : (
                      'Run'
                    )}
                  </button>
                )}
              </div>

              {/* Script Information */}
              {selectedScript && (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500">
                        Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {selectedScript.type}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500">
                        File Path
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {selectedScript.path}
                      </dd>
                    </div>
                    {selectedScript.arguments &&
                      selectedScript.arguments.length > 0 && (
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500">
                            Arguments
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {selectedScript.arguments.join(', ')}
                          </dd>
                        </div>
                      )}
                  </dl>
                </div>
              )}

              {/* Console Output */}
              <div className="flex flex-grow flex-col border-t border-gray-200">
                <div className="bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500">
                  Console Output
                </div>
                <div className="flex-grow overflow-auto bg-black p-4 font-mono text-sm text-white">
                  {scriptOutput ? (
                    <pre className="whitespace-pre-wrap">{scriptOutput}</pre>
                  ) : (
                    <p className="text-gray-500">
                      Output will appear here after running the script
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
