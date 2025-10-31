import type { ReplacementSuggestion } from './checker.js'

import pc from 'picocolors'

/**
 * Format suggestions as JSON
 */
export function formatJSON(suggestions: ReplacementSuggestion[]): string {
  return JSON.stringify(suggestions, null, 2)
}

/**
 * Calculate max width for each column
 */
function calculateColumnWidths(suggestions: ReplacementSuggestion[]): {
  pkg: number
  version: number
  suggestion: number
  source: number
} {
  return {
    pkg: Math.max(
      'Package'.length,
      ...suggestions.map(s => s.packageName.length),
    ),
    version: Math.max(
      'Version'.length,
      ...suggestions.map(s => s.currentVersion.length),
    ),
    suggestion: Math.max(
      'Suggestion'.length,
      ...suggestions.map(s => s.suggestion.length),
    ),
    source: Math.max(
      'Source'.length,
      ...suggestions.map(s => s.source.length),
    ),
  }
}

/**
 * Format suggestions as a table
 */
export function formatTable(suggestions: ReplacementSuggestion[]): string {
  if (suggestions.length === 0) {
    return pc.green('✓ No replaceable dependencies found!')
  }

  const widths = calculateColumnWidths(suggestions)
  const lines: string[] = []

  // Header
  const header = [
    pc.bold('Package'.padEnd(widths.pkg)),
    pc.bold('Version'.padEnd(widths.version)),
    pc.bold('Suggestion'.padEnd(widths.suggestion)),
    pc.bold('Source'.padEnd(widths.source)),
  ].join(' │ ')

  lines.push(header)

  // Separator
  const separator = [
    '─'.repeat(widths.pkg),
    '─'.repeat(widths.version),
    '─'.repeat(widths.suggestion),
    '─'.repeat(widths.source),
  ].join('─┼─')

  lines.push(separator)

  // Rows
  for (const suggestion of suggestions) {
    const row = [
      pc.yellow(suggestion.packageName.padEnd(widths.pkg)),
      pc.cyan(suggestion.currentVersion.padEnd(widths.version)),
      suggestion.suggestion.padEnd(widths.suggestion),
      pc.dim(suggestion.source.padEnd(widths.source)),
    ].join(' │ ')

    lines.push(row)
  }

  // Summary
  lines.push('')
  lines.push(
    pc.yellow(`Found ${suggestions.length} package(s) with better alternatives`),
  )

  return lines.join('\n')
}
