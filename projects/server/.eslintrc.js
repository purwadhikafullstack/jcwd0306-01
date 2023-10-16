module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      files: ['src/migrations/*', 'src/models/*', 'src/seeders/*'],
      rules: {
        strict: 'off',
        'no-unused-vars': 'off',
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
        semi: true,
        trailingComma: 'es5',
      },
    ],
  },
};
