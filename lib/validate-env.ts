// File: lib/validate-env.ts
import { validateEnv } from '@lib/env';

// This file should be imported in your app's entry point

// Validate required environment variables
validateEnv();

// Log environment mode
console.info(`🚀 Running in ${process.env.NODE_ENV} mode`);

// Export something to make this a module
export default {};
