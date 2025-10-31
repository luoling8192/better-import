#!/usr/bin/env node

import process from 'node:process'

import { cac } from 'cac'
import pc from 'picocolors'

import { checkAllPackages, checkPackage } from './checker.js'
import { formatJSON, formatTable } from './formatter.js'
import { scanPackages } from './scanner.js'

const cli = cac('better-import')

cli
  .command('check', 'Check all packages in monorepo for replaceable dependencies')
  .option('--json', 'Output in JSON format', { default: false })
  .option('--cwd <path>', 'Working directory', { default: process.cwd() })
  .action(async (options) => {
    try {
      console.log('Scanning packages...')
      const packages = await scanPackages(options.cwd)
      const suggestions = checkAllPackages(packages)

      const output = options.json
        ? formatJSON(suggestions)
        : formatTable(suggestions)

      console.log(output)

      if (suggestions.length > 0) {
        process.exitCode = 1
      }
    }
    catch (error) {
      console.error(pc.red((error as Error).message))
      process.exit(1)
    }
  })

cli
  .command('query <package>', 'Query if a specific package has better alternatives')
  .option('--json', 'Output in JSON format', { default: false })
  .action((packageName: string, options) => {
    const suggestion = checkPackage(packageName)

    if (!suggestion) {
      if (options.json) {
        console.log(JSON.stringify({ found: false, package: packageName }))
      }
      else {
        console.log(pc.green(`✓ No better alternative found for ${pc.bold(packageName)}`))
      }
      return
    }

    if (options.json) {
      console.log(
        JSON.stringify({
          found: true,
          package: packageName,
          suggestion,
        }, null, 2),
      )
    }
    else {
      console.log(pc.yellow(pc.bold(packageName)))
      console.log(`  ${pc.cyan('→')} ${suggestion}`)
    }

    process.exitCode = 1
  })

cli.help()
cli.version('1.0.0')

cli.parse()
