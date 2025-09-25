module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@react-three/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.*'],
  parser: '@typescript-eslint/parser',
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    '@react-three': ReactThree,
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    semi: 'off',
    indent: ['error', 2, { SwitchCase: 1, MemberExpression: 1 }],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
}
