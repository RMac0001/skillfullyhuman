import { createTheme, Button, DEFAULT_THEME } from '@mantine/core';

export const theme = createTheme({
  ...DEFAULT_THEME,
  colors: {
    ...DEFAULT_THEME.colors,
    'sugar-milk': [
      '#fffbf5',
      '#fcecd5',
      '#fcd8a4',
      '#fcc26f',
      '#fbb044',
      '#fba42c',
      '#fc9e21',
      '#e08917',
      '#c87a0f',
      '#ad6800',
    ],
    'peach-breeze': [
      '#ffeee7',
      '#fcddd3',
      '#f3b9a7',
      '#ec9377',
      '#e6734f',
      '#e35e35',
      '#e25327',
      '#cd451b',
      '#b33a15',
      '#9d2f0e',
    ],
    'white-smoke': [
      '#f5f5f4',
      '#e8e8e8',
      '#cecece',
      '#b3b3b3',
      '#9c9c9c',
      '#8d8d8d',
      '#868686',
      '#737373',
      '#676665',
      '#252422',
    ],
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        color: 'peach-breeze',
        variant: 'filled',
      },
    }),
  },
  fontFamily: "'Lato', sans-serif",
});
