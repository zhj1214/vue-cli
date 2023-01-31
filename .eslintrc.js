module.exports = {
  env: {
    'vue/setup-compiler-macros': true,
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    wx: true,
    uni: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'no-undef': 'off',
        'prefer-rest-params': 'off'
      }
    },
    {
      files: ['scripts/*.js'],
      env: {
        node: true
      }
    }
  ],

  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', '/src'],
          ['@assets', '/src/assets'],
          ['@utils', '/src/utils'],
          ['@components', '/src/components'],
          ['@views', '/src/views'],
          ['@store', '/src/store']
        ]
      }
    }
  },
  rules: {}
}
