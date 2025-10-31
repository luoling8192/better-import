import type { ReplacementSuggestion } from './checker.js'

import { describe, expect, it } from 'vitest'

import { formatJSON, formatTable } from './formatter.js'

describe('formatter', () => {
  describe('formatJSON', () => {
    it('should format suggestions as JSON', () => {
      const suggestions: ReplacementSuggestion[] = [
        {
          packageName: 'axios',
          currentVersion: '^1.0.0',
          suggestion: 'Use https://www.npmjs.com/package/ky instead.',
          source: '/test/package.json',
        },
      ]

      const result = formatJSON(suggestions)
      const parsed = JSON.parse(result)

      expect(parsed).toHaveLength(1)
      expect(parsed[0].packageName).toBe('axios')
      expect(parsed[0].currentVersion).toBe('^1.0.0')
    })

    it('should format empty array', () => {
      const result = formatJSON([])
      expect(result).toBe('[]')
    })

    it('should format multiple suggestions', () => {
      const suggestions: ReplacementSuggestion[] = [
        {
          packageName: 'axios',
          currentVersion: '^1.0.0',
          suggestion: 'Use ky',
          source: '/test/package.json',
        },
        {
          packageName: 'lodash',
          currentVersion: '^4.17.0',
          suggestion: 'Use es-toolkit',
          source: '/test/package.json',
        },
      ]

      const result = formatJSON(suggestions)
      const parsed = JSON.parse(result)

      expect(parsed).toHaveLength(2)
    })
  })

  describe('formatTable', () => {
    it('should return success message for empty suggestions', () => {
      const result = formatTable([])
      expect(result).toContain('No replaceable dependencies found')
    })

    it('should format single suggestion as table', () => {
      const suggestions: ReplacementSuggestion[] = [
        {
          packageName: 'axios',
          currentVersion: '^1.0.0',
          suggestion: 'Use ky',
          source: '/test/package.json',
        },
      ]

      const result = formatTable(suggestions)

      expect(result).toContain('Package')
      expect(result).toContain('Version')
      expect(result).toContain('Suggestion')
      expect(result).toContain('Source')
      expect(result).toContain('axios')
      expect(result).toContain('^1.0.0')
      expect(result).toContain('Use ky')
      expect(result).toContain('/test/package.json')
      expect(result).toContain('Found 1 package')
    })

    it('should format multiple suggestions', () => {
      const suggestions: ReplacementSuggestion[] = [
        {
          packageName: 'axios',
          currentVersion: '^1.0.0',
          suggestion: 'Use ky',
          source: '/root/package.json',
        },
        {
          packageName: 'lodash',
          currentVersion: '^4.17.0',
          suggestion: 'Use es-toolkit',
          source: '/packages/app/package.json',
        },
      ]

      const result = formatTable(suggestions)

      expect(result).toContain('axios')
      expect(result).toContain('lodash')
      expect(result).toContain('Found 2 package')
    })

    it('should include table separators', () => {
      const suggestions: ReplacementSuggestion[] = [
        {
          packageName: 'axios',
          currentVersion: '^1.0.0',
          suggestion: 'Use ky',
          source: '/test/package.json',
        },
      ]

      const result = formatTable(suggestions)

      expect(result).toContain('│')
      expect(result).toContain('─')
    })
  })
})
