import type { ScannedPackage } from './scanner.js'

import { describe, expect, it } from 'vitest'

import { checkAllPackages, checkDependencies, checkPackage } from './checker.js'

describe('checker', () => {
  describe('checkPackage', () => {
    it('should return suggestion for axios', () => {
      const result = checkPackage('axios')
      expect(result).toBe('Use https://www.npmjs.com/package/ky instead.')
    })

    it('should return suggestion for lodash', () => {
      const result = checkPackage('lodash')
      expect(result).toBe('Use https://es-toolkit.slash.page instead.')
    })

    it('should return null for packages without alternatives', () => {
      const result = checkPackage('express')
      expect(result).toBeNull()
    })

    it('should return null for non-existent packages', () => {
      const result = checkPackage('some-random-package-xyz')
      expect(result).toBeNull()
    })
  })

  describe('checkDependencies', () => {
    it('should find replaceable dependencies in a package', () => {
      const scannedPackage: ScannedPackage = {
        path: '/test/package.json',
        packageJson: {
          name: 'test-package',
          dependencies: {
            axios: '^1.0.0',
            express: '^4.18.0',
          },
        },
        allDependencies: new Map([
          ['axios', '^1.0.0'],
          ['express', '^4.18.0'],
        ]),
      }

      const suggestions = checkDependencies(scannedPackage)

      expect(suggestions).toHaveLength(1)
      expect(suggestions[0]).toEqual({
        packageName: 'axios',
        currentVersion: '^1.0.0',
        suggestion: 'Use https://www.npmjs.com/package/ky instead.',
        source: '/test/package.json',
      })
    })

    it('should return empty array when no replaceable dependencies', () => {
      const scannedPackage: ScannedPackage = {
        path: '/test/package.json',
        packageJson: {
          name: 'test-package',
          dependencies: {
            express: '^4.18.0',
          },
        },
        allDependencies: new Map([['express', '^4.18.0']]),
      }

      const suggestions = checkDependencies(scannedPackage)

      expect(suggestions).toHaveLength(0)
    })

    it('should check all dependency types', () => {
      const scannedPackage: ScannedPackage = {
        path: '/test/package.json',
        packageJson: {
          dependencies: { axios: '^1.0.0' },
          devDependencies: { lodash: '^4.17.0' },
          peerDependencies: { chalk: '^5.0.0' },
        },
        allDependencies: new Map([
          ['axios', '^1.0.0'],
          ['lodash', '^4.17.0'],
          ['chalk', '^5.0.0'],
        ]),
      }

      const suggestions = checkDependencies(scannedPackage)

      expect(suggestions).toHaveLength(3)
      expect(suggestions.map(s => s.packageName)).toEqual(['axios', 'lodash', 'chalk'])
    })
  })

  describe('checkAllPackages', () => {
    it('should check multiple packages', () => {
      const packages: ScannedPackage[] = [
        {
          path: '/root/package.json',
          packageJson: { dependencies: { axios: '^1.0.0' } },
          allDependencies: new Map([['axios', '^1.0.0']]),
        },
        {
          path: '/packages/app/package.json',
          packageJson: { dependencies: { lodash: '^4.17.0' } },
          allDependencies: new Map([['lodash', '^4.17.0']]),
        },
      ]

      const suggestions = checkAllPackages(packages)

      expect(suggestions).toHaveLength(2)
      expect(suggestions[0].packageName).toBe('axios')
      expect(suggestions[0].source).toBe('/root/package.json')
      expect(suggestions[1].packageName).toBe('lodash')
      expect(suggestions[1].source).toBe('/packages/app/package.json')
    })

    it('should return empty array for packages without replaceable deps', () => {
      const packages: ScannedPackage[] = [
        {
          path: '/test/package.json',
          packageJson: { dependencies: { express: '^4.18.0' } },
          allDependencies: new Map([['express', '^4.18.0']]),
        },
      ]

      const suggestions = checkAllPackages(packages)

      expect(suggestions).toHaveLength(0)
    })
  })
})
