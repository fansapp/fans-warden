module.exports = {
  env: {
    mocha: true,
    browser: true,
    es6: true,
  },
  globals: {},
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    sourceType: 'module',
  },
  rules: {
    'max-len': ['warn', 100],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
  },
};
