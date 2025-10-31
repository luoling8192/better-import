#!/usr/bin/env node

import process from 'node:process'

import { flush, run } from '@oclif/core'

await run(process.argv.slice(2), import.meta.url)
await flush()
