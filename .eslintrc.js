/*
 * @Description: 规范代码格式校验
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-28 14:24:23
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-29 14:56:37
 */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    'arrow-parens': 'off', // 箭头函数的参数可以不使用圆括号
    'linebreak-style': 'off', // 取消换行符\n或\r\n的验证
    'object-curly-newline': ['error', { consistent: true }], // 花括号内的换行符不一定要格式一致
    'function-paren-newline': 'off', // 不验证函数括号内的换行
    'import/extensions': 'off', // 取消对文件扩展名的验证
    'no-param-reassign': 'off', // 允许对函数参数进行再赋值
    'no-underscore-dangle': 'off', // 允许在标识符中使用下划线
    'no-use-before-define': 'off', // 允许变量和函数在定义前使用
    'no-unused-expressions': 'off', // 允许使用未使用过的表达式，以此来支持a && a()的代码形式
    'consistent-return': 'off', // 关闭函数中return的检测
    'no-shadow': 'off', // 可以使用同名变量,
    'newline-per-chained-call': 'off', //取消方法链调用中的换行符的检测
    'import/newline-after-import': 'off',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-eval': 'error',
    'no-alert': 'error',
    'vue/max-attributes-per-line': [
      0,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'accessor-pairs': 2,

    'block-spacing': [2, 'always'],
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    camelcase: [
      0,
      {
        properties: 'always',
      },
    ],
    'comma-dangle': [2, 'only-multiline'],
    'comma-style': [2, 'last'],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    'dot-location': [2, 'property'],
    'eol-last': 2,
    eqeqeq: [
      'warn',
      'always',
      {
        null: 'ignore',
      },
    ],
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'handle-callback-err': [2, '^(err|error)$'],
    'jsx-quotes': [2, 'prefer-single'],
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false,
      },
    ],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-control-regex': 0,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-empty-pattern': 2,
    'no-ex-assign': 2,
    'no-extend-native': 1,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    'no-lone-blocks': 2,
    'no-mixed-spaces-and-tabs': 1,
    'no-multi-spaces': 2,
    'no-multi-str': 2,

    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': [2, 'except-parens'],
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 0,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false,
      },
    ],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none',
      },
    ],
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'one-var': [
      2,
      {
        initialized: 'never',
      },
    ],
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      },
    ],
    'padded-blocks': [2, 'never'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],

    'space-in-parens': [2, 'never'],
    'space-infix-ops': 1,
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false,
      },
    ],
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2,
    'valid-typeof': 2,
    'wrap-iife': [2, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
    'prefer-const': 2,
    'array-bracket-spacing': [2, 'never'],
    'no-prototype-builtins': 0,
    // 自定义开始
    'vue/html-indent': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/html-self-closing': 0,
    semi: 0,
    'comma-spacing': 0,
    'space-before-blocks': 0,
    'keyword-spacing': 0,
    'key-spacing': 0,
    'no-multiple-empty-lines': 0,
    'spaced-comment': 0,
    'space-before-function-paren': 0,
    'arrow-spacing': 0,
    'object-curly-spacing': 0,
  },
}
