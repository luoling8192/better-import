import type { ScannedPackage } from './scanner.js'

import { BETTER_ALTERNATIVES } from './rules/sukka.js'

export interface ReplacementSuggestion {
  packageName: string
  currentVersion: string
  suggestion: string
  source: string // which package.json file
}

/**
 * Build a map of restricted packages for fast lookup
 */
const restrictedMap = new Map<string, string>(
  BETTER_ALTERNATIVES.map(item => [item.name, item.message]),
)

/**
 * Check if a package has better alternatives
 */
export function checkPackage(packageName: string): string | null {
  return restrictedMap.get(packageName) || null
}

/**
 * Check all dependencies in a scanned package
 */
export function checkDependencies(
  scannedPackage: ScannedPackage,
): ReplacementSuggestion[] {
  const suggestions: ReplacementSuggestion[] = []

  for (const [pkgName, version] of scannedPackage.allDependencies) {
    const suggestion = checkPackage(pkgName)
    if (suggestion) {
      suggestions.push({
        packageName: pkgName,
        currentVersion: version,
        suggestion,
        source: scannedPackage.path,
      })
    }
  }

  return suggestions
}

/**
 * Check all scanned packages
 */
export function checkAllPackages(
  scannedPackages: ScannedPackage[],
): ReplacementSuggestion[] {
  const allSuggestions: ReplacementSuggestion[] = []

  for (const pkg of scannedPackages) {
    const suggestions = checkDependencies(pkg)
    allSuggestions.push(...suggestions)
  }

  return allSuggestions
}
