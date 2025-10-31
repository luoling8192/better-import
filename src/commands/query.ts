import process from 'node:process'

import { Args, Command, Flags } from '@oclif/core'
import pc from 'picocolors'

import { checkPackage } from '../checker.js'

export default class Query extends Command {
  static override description = 'Query if a specific package has better alternatives'

  static override examples = [
    '<%= config.bin %> <%= command.id %> axios',
    '<%= config.bin %> <%= command.id %> lodash --json',
  ]

  static override flags = {
    json: Flags.boolean({
      description: 'Output in JSON format',
      default: false,
    }),
  }

  static override args = {
    package: Args.string({
      description: 'Package name to query',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Query)
    const packageName = args.package

    const suggestion = checkPackage(packageName)

    if (!suggestion) {
      if (flags.json) {
        this.log(JSON.stringify({ found: false, package: packageName }))
      }
      else {
        this.log(pc.green(`✓ No better alternative found for ${pc.bold(packageName)}`))
      }
      return
    }

    if (flags.json) {
      this.log(
        JSON.stringify({
          found: true,
          package: packageName,
          suggestion,
        }, null, 2),
      )
    }
    else {
      this.log(pc.yellow(`${pc.bold(packageName)}`))
      this.log(pc.dim('───────────────────────'))
      this.log(suggestion)
    }

    process.exitCode = 1
  }
}
