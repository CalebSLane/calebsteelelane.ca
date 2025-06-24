import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules',
      '**/.git',
      '**/target',
      '**/build',
      '**/logs',
      '**/backups',
      'data',
      'docs/generated',
      'coverage',
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ['app/**', 'staticapp/**'],
    ...pluginReact.configs.flat.recommended,
  },
  {
    files: ['app/**/__tests__/**'],
    ...pluginJest.configs['flat/recommended'],
    settings: {
      jest: {
        version: 27,
      },
    },
  },
  eslintConfigPrettier,
];
