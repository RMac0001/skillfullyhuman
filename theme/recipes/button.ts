import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: 'md',
    fontWeight: 'semibold',
    px: '4',
    py: '2',
  },
  variants: {
    visual: {
      solid: {
        background: 'chakra-colors-{colorScheme}',
        color: 'white',
        _hover: {
          background: 'chakra-colors-{colorScheme}-hover',
        },
        _active: {
          background: 'chakra-colors-{colorScheme}-active',
        },
      },
    },
  },
});
