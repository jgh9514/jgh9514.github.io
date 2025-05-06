import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      'vue/require-prop-types': 'off',
      'no-console': 'error',
      'vue/component-definition-name-casing': 'off'
    }
  },
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: 'none',
          printWidth: 100,
          bracketSpacing: true,
          arrowParens: 'always',
          endOfLine: 'auto'
        }
      ]
    }
  }
)
