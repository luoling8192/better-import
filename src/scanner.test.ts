import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { scanPackages } from './scanner.js'

describe('scanner', () => {
  let testDir: string

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = join(tmpdir(), `test-scanner-${Date.now()}`)
    await mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true })
  })

  it('should scan root package.json', async () => {
    const packageJson = {
      name: 'test-root',
      dependencies: {
        axios: '^1.0.0',
      },
      devDependencies: {
        vitest: '^2.0.0',
      },
    }

    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    )

    const packages = await scanPackages(testDir)

    expect(packages).toHaveLength(1)
    expect(packages[0].packageJson.name).toBe('test-root')
    expect(packages[0].allDependencies.size).toBe(2)
    expect(packages[0].allDependencies.get('axios')).toBe('^1.0.0')
    expect(packages[0].allDependencies.get('vitest')).toBe('^2.0.0')
  })

  it('should scan workspaces (array format)', async () => {
    const rootPkg = {
      name: 'monorepo-root',
      workspaces: ['packages/*'],
      dependencies: { axios: '^1.0.0' },
    }

    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(rootPkg, null, 2),
    )

    // Create workspace packages
    await mkdir(join(testDir, 'packages', 'app'), { recursive: true })
    await mkdir(join(testDir, 'packages', 'lib'), { recursive: true })

    const appPkg = {
      name: 'app',
      dependencies: { lodash: '^4.17.0' },
    }

    const libPkg = {
      name: 'lib',
      dependencies: { chalk: '^5.0.0' },
    }

    await writeFile(
      join(testDir, 'packages', 'app', 'package.json'),
      JSON.stringify(appPkg, null, 2),
    )

    await writeFile(
      join(testDir, 'packages', 'lib', 'package.json'),
      JSON.stringify(libPkg, null, 2),
    )

    const packages = await scanPackages(testDir)

    expect(packages).toHaveLength(3)
    expect(packages[0].packageJson.name).toBe('monorepo-root')
    expect(packages.some(p => p.packageJson.name === 'app')).toBe(true)
    expect(packages.some(p => p.packageJson.name === 'lib')).toBe(true)
  })

  it('should scan workspaces (object format)', async () => {
    const rootPkg = {
      name: 'monorepo-root',
      workspaces: {
        packages: ['apps/*'],
      },
    }

    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(rootPkg, null, 2),
    )

    await mkdir(join(testDir, 'apps', 'web'), { recursive: true })

    const webPkg = {
      name: 'web',
      dependencies: { axios: '^1.0.0' },
    }

    await writeFile(
      join(testDir, 'apps', 'web', 'package.json'),
      JSON.stringify(webPkg, null, 2),
    )

    const packages = await scanPackages(testDir)

    expect(packages).toHaveLength(2)
    expect(packages[0].packageJson.name).toBe('monorepo-root')
    expect(packages[1].packageJson.name).toBe('web')
  })

  it('should handle package without workspaces', async () => {
    const packageJson = {
      name: 'single-package',
      dependencies: { express: '^4.18.0' },
    }

    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    )

    const packages = await scanPackages(testDir)

    expect(packages).toHaveLength(1)
    expect(packages[0].packageJson.name).toBe('single-package')
  })

  it('should throw error when no package.json found', async () => {
    await expect(scanPackages(testDir)).rejects.toThrow(
      'No package.json found in current directory',
    )
  })

  it('should merge all dependency types', async () => {
    const packageJson = {
      name: 'test-deps',
      dependencies: { dep1: '^1.0.0' },
      devDependencies: { dep2: '^2.0.0' },
      peerDependencies: { dep3: '^3.0.0' },
      optionalDependencies: { dep4: '^4.0.0' },
    }

    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    )

    const packages = await scanPackages(testDir)

    expect(packages[0].allDependencies.size).toBe(4)
    expect(packages[0].allDependencies.get('dep1')).toBe('^1.0.0')
    expect(packages[0].allDependencies.get('dep2')).toBe('^2.0.0')
    expect(packages[0].allDependencies.get('dep3')).toBe('^3.0.0')
    expect(packages[0].allDependencies.get('dep4')).toBe('^4.0.0')
  })
})
