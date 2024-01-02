module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugin: ['import'],
  rules: {
    'prefer-const': 'warn',
    'no-var': 'error',
    'no-new-object': 'error',
    'object-shorthand': 'error',
    'no-array-constructor': 'error',
    'prefer-destructuring': 'warn',
    'prefer-template': 'error',
    'wrap-iife': ['error', 'any'],
    'no-loop-func': 'error',
    'prefer-rest-params': 'error',
    'no-new-func': 'error',
    'no-param-reassign': 'error',
    'prefer-spread': 'error',
    'prefer-arrow-callback': 'error',
    'import/prefer-default-export': 'error',
    'import/first': 'warn',
    'no-case-declarations': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'brace-style': 'error',
  },
};
