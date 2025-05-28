/*
File: lib/validate-env.ts
Why It Matters
Without this validation:

App might start with missing env vars
Database connections could fail silently
Auth might break in production
Features might be misconfigured

Add import '@/lib/validate-env'; to the top of app/layout.tsx file.
This ensures environment validation runs before app starts,
and will catch configuration issues early rather than having mysterious runtime failures.
*/

import { validateEnv } from '@lib/env';

// This file should be imported in your app's entry point

// Validate required environment variables
validateEnv();

// Log environment mode
console.info(`🚀 Running in ${process.env.NODE_ENV} mode`);

// Export something to make this a module
export default {};
