import type { ReplacementSuggestion } from './checker.js'

import pc from 'picocolors'

/**
 * Format suggestions as JSON
 */
export function formatJSON(suggestions: ReplacementSuggestion[]): string {
  return JSON.stringify(suggestions, null, 2)
}

/**
 * Format suggestions as a table with multi-line layout
 */
export function formatTable(suggestions: ReplacementSuggestion[]): string {
  if (suggestions.length === 0) {
    return pc.green('✓ No replaceable dependencies found!')
  }

  const lines: string[] = []

  for (let i = 0; i < suggestions.length; i++) {
    const s = suggestions[i]

    // Add separator between items
    if (i > 0) {
      lines.push('')
    }

    // Package name and version
    lines.push(`${pc.yellow(pc.bold(s.packageName))} ${pc.dim(`(${s.currentVersion})`)}`)

    // Suggestion
    lines.push(`  ${pc.cyan('→')} ${s.suggestion}`)

    // Source path
    lines.push(`  ${pc.dim(s.source)}`)
  }

  // Summary
  lines.push('')
  lines.push(pc.yellow(`Found ${suggestions.length} package(s) with better alternatives`))

  return lines.join('\n')
}
