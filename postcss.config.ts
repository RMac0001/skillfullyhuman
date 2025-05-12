// postcss.config.ts
import type { Config } from 'postcss-load-config';

const config: Config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // If you need the @tailwindcss/postcss plugin, add it here
    // '@tailwindcss/postcss': {},
  },
};

export default config;
