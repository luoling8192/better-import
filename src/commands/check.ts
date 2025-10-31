import process from 'node:process'

import { Command, Flags } from '@oclif/core'

import { checkAllPackages } from '../checker.js'
import { formatJSON, formatTable } from '../formatter.js'
import { scanPackages } from '../scanner.js'

export default class Check extends Command {
  static override description = 'Check all packages in monorepo for replaceable dependencies'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --json',
    '<%= config.bin %> <%= command.id %> --cwd /path/to/project',
  ]

  static override flags = {
    json: Flags.boolean({
      description: 'Output in JSON format',
      default: false,
    }),
    cwd: Flags.string({
      description: 'Working directory',
      default: process.cwd(),
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Check)

    try {
      this.log('Scanning packages...')
      const packages = await scanPackages(flags.cwd)
      const suggestions = checkAllPackages(packages)

      const output = flags.json
        ? formatJSON(suggestions)
        : formatTable(suggestions)

      this.log(output)

      // Exit with code 1 if suggestions found
      if (suggestions.length > 0) {
        process.exitCode = 1
      }
    }
    catch (error) {
      this.error((error as Error).message)
    }
  }
}
