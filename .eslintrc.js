// src/wallet-app/.eslintrc.js (crie este arquivo se não existir)
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Adicione ou atualize para 2020 ou 2021
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json', // Certifique-se de que o caminho está correto
  },
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Certifique-se que prettier está no final para evitar conflitos
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Suas regras personalizadas aqui, se tiver
  },
};