module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "@dcloudio/types": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
  ],

  "parser": 'vue-eslint-parser',
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "settings": {
    "import/resolver": {
      alias: {
        map: [
          ["@", "./src/"],
          ["@assets", "./src/assets/"],
          ["@utils", "./src/utils/"],
          ["@components", "./src/components/"],
          ["@views", "./src/views/"],
          ["@store", "./src/store/"],
        ],
      },
    },
  },
  "rules": {
  }
}
