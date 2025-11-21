//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';
import tseslint from 'typescript-eslint';

export default [
  ...tanstackConfig,
  {
    files: ['eslint.config.js', 'prettier.config.js', 'vite.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },
];
