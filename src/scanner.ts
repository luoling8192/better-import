import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'
import { parse } from 'yaml'

export interface PackageJson {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  workspaces?: string[] | { packages: string[] }
}

export interface ScannedPackage {
  path: string
  packageJson: PackageJson
  allDependencies: Map<string, string>
}

/**
 * Parse workspaces field from package.json
 */
function parseWorkspaces(workspaces: PackageJson['workspaces']): string[] {
  if (!workspaces)
    return []
  return Array.isArray(workspaces) ? workspaces : workspaces.packages
}

/**
 * Read pnpm-workspace.yaml
 */
async function readPnpmWorkspace(cwd: string): Promise<string[]> {
  try {
    const content = await readFile(join(cwd, 'pnpm-workspace.yaml'), 'utf-8')
    const config = parse(content) as { packages?: string[] }
    return config.packages || []
  }
  catch {
    return []
  }
}

/**
 * Read and parse package.json
 */
async function readPackageJson(path: string): Promise<PackageJson | null> {
  try {
    const content = await readFile(path, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}

/**
 * Get all dependencies from package.json
 */
function getAllDependencies(pkg: PackageJson): Map<string, string> {
  const deps = new Map<string, string>()

  const sources = [
    pkg.dependencies,
    pkg.devDependencies,
    pkg.peerDependencies,
    pkg.optionalDependencies,
  ]

  for (const source of sources) {
    if (source) {
      for (const [name, version] of Object.entries(source)) {
        if (!deps.has(name)) {
          deps.set(name, version)
        }
      }
    }
  }

  return deps
}

/**
 * Scan all package.json in monorepo
 */
export async function scanPackages(cwd: string = process.cwd()): Promise<ScannedPackage[]> {
  const rootPkgPath = join(cwd, 'package.json')
  const rootPkg = await readPackageJson(rootPkgPath)

  if (!rootPkg) {
    throw new Error('No package.json found in current directory')
  }

  const results: ScannedPackage[] = [
    {
      path: rootPkgPath,
      packageJson: rootPkg,
      allDependencies: getAllDependencies(rootPkg),
    },
  ]

  // Try pnpm-workspace.yaml first, then fallback to package.json workspaces
  let workspacePatterns = await readPnpmWorkspace(cwd)
  if (workspacePatterns.length === 0) {
    workspacePatterns = parseWorkspaces(rootPkg.workspaces)
  }

  if (workspacePatterns.length > 0) {
    const workspacePaths = await fg(
      workspacePatterns.map(p => join(p, 'package.json')),
      { cwd, absolute: true },
    )

    for (const pkgPath of workspacePaths) {
      const pkg = await readPackageJson(pkgPath)
      if (pkg) {
        results.push({
          path: pkgPath,
          packageJson: pkg,
          allDependencies: getAllDependencies(pkg),
        })
      }
    }
  }

  return results
}
