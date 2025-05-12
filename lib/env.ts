// File: lib/env.ts
// Helper for accessing environment variables with type safety

type EnvVariable = string | undefined;

// Required environment variables
const requiredEnvs = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

// Optional environment variables with default values
const optionalEnvs = {
  NODE_ENV: 'development',
  ENABLE_BLOG: 'true',
  ENABLE_LESSONS: 'true',
  ENABLE_RENASCEND: 'true',
} as const;

// Type for required env variables
type RequiredEnv = (typeof requiredEnvs)[number];

// Type for optional env variables
type OptionalEnv = keyof typeof optionalEnvs;

// Get a required environment variable
export function getEnv(key: RequiredEnv): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
}

// Get an optional environment variable with a default value
export function getOptionalEnv(key: OptionalEnv): string {
  const value = process.env[key];

  if (!value) {
    return optionalEnvs[key];
  }

  return value;
}

// Check if a feature is enabled via environment variable
export function isFeatureEnabled(
  key: 'ENABLE_BLOG' | 'ENABLE_LESSONS' | 'ENABLE_RENASCEND',
): boolean {
  return getOptionalEnv(key) === 'true';
}

// Get all environment variables for validation on startup
export function validateEnv(): void {
  // Check required environment variables
  for (const key of requiredEnvs) {
    getEnv(key);
  }

  // Log validation result
  console.info('✅ Environment variables validated');
}
