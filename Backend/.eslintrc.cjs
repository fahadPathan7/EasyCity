module.exports = {
    root: true,
    env: {
      node: true,
      es2020: true,
    },
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'no-use-before-define': ['error', { functions: false, classes: true }],
      'no-undef': 'error', // Mark usage of undeclared variables as error
    },
  };