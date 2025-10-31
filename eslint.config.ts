import config from '@unbird/eslint-config'

export default config({
  ignores: [
    'cspell.config.yaml',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
})
