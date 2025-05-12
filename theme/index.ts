// theme/index.ts
import { createSystem, defaultConfig } from '@chakra-ui/react';
import { buttonRecipe } from './recipes/button';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f9f9' },
          500: { value: '#0d9488' },
          600: { value: '#0c827a' },
          700: { value: '#0f766e' },
        },
      },
    },
    semanticTokens: {
      colors: {
        'chakra-colors-brand': {
          default: { value: '{colors.brand.500}' }, // ✅ CORRECT
        },
        'chakra-colors-brand-hover': {
          default: { value: '{colors.brand.600}' },
        },
        'chakra-colors-brand-active': {
          default: { value: '{colors.brand.700}' },
        },
      },
    },
    recipes: {
      Button: buttonRecipe,
    },
  },
});
