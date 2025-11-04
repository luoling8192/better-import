# better-import

CLI tool to detect replaceable dependencies in your package.json files. Automatically scans monorepo workspaces and suggests better, lighter, or more performant alternatives.

## Features

- 🔍 **Auto-detect workspaces**: Supports `pnpm-workspace.yaml` and `package.json` workspaces (npm/yarn/pnpm)
- 📦 **Query mode**: Check if a specific dependency has better alternatives
- 🎨 **Multiple output formats**: Clean multi-line layout or JSON for CI/CD integration
- ⚡ **Fast & lightweight**: Uses curated rules from industry best practices

## Installation

### As a global CLI tool

```bash
# pnpm
pnpm add -g @unbird/better-import
```

### As a dev dependency

```bash
# pnpm
pnpm add -D @unbird/better-import
```

### From source

```bash
git clone https://github.com/yourusername/better-import
cd better-import
pnpm install
pnpm build
```

## Quick Start

Run without installing globally:

### pnpm

```bash
pnpm -s dlx @unbird/better-import@latest check
# or
pnpx -s @unbird/better-import@latest check
```

### bun

```bash
bunx -y @unbird/better-import@latest check
```

### npm

```bash
npx -y @unbird/better-import@latest check
```

## Usage

### Check all packages in monorepo

```bash
better-import check
```

Output:
```
Scanning packages...
axios (^1.0.0)
  → Use https://www.npmjs.com/package/ky instead.
  /path/to/package.json

lodash (^4.17.0)
  → Use https://es-toolkit.slash.page instead.
  /path/to/package.json

Found 2 package(s) with better alternatives
```

### Query specific package

```bash
better-import query axios
```

Output:
```
axios
  → Use https://www.npmjs.com/package/ky instead.
```

### JSON output

```bash
better-import check --json
better-import query lodash --json
```

## Commands

### `check`
Check all packages in monorepo for replaceable dependencies.

```bash
better-import check [--json] [--cwd <path>]
```

**Flags:**
- `--json`: Output in JSON format
- `--cwd <path>`: Working directory (default: current directory)

### `query <package>`
Query if a specific package has better alternatives.

```bash
better-import query <package> [--json]
```

**Flags:**
- `--json`: Output in JSON format

### Help
```bash
better-import --help
better-import check --help
better-import query --help
```

## Exit Codes

- `0`: No replaceable dependencies found
- `1`: Found replaceable dependencies (useful for CI/CD)

## Prompt Engineering (for LLMs)

This prompt can be used to guide language models (e.g., Claude Code, OpenAI Codex) in suggesting better alternatives for npm packages based on curated rules.

```markdown
## Tool: `@unbird/better-import`

### What is it?

A CLI that scans package.json files (including workspaces) and suggests better, lighter, or more performant alternatives.

### What can it do?

- Scan all workspaces and list replaceable dependencies
- Query a single package for recommended alternatives
- Output JSON for CI/CD pipelines

### How to use it?

Please run the following commands to use the tool:

- For using pnpm: `pnpm -s dlx @unbird/better-import ...args` or `pnpx -s @unbird/better-import ...args`
- For using bun: `bunx -y @unbird/better-import ...args`
- For using npm: `npx -y @unbird/better-import ...args`

Available commands:

- `... check`: Scan all packages for replaceable dependencies
- `... check --json`: Same as `... check` but outputs JSON to stdout
- `... query <package>`: Query a specific package for recommended alternatives

### When to use it?

- During dependency audits, PR checks, or CI to enforce best-practice alternatives.
- When deciding whether to adopt a dependency or replace an existing one.
- Before introducing a new npm package, please run a `query` first.

### Exit codes explained

- 0: No replaceable dependencies
- 1: Replaceable dependencies found (good for CI fail-fast)
```

## Rules Source

The replacement rules are based on [`src/rules/`](./src/rules/), which maintains curated lists of common dependencies and their better alternatives from industry best practices.

### Sukka

https://github.com/SukkaW/eslint-config-sukka/blob/308947197c4d06d7261a5fab5c81257e79a6133e/packages/shared/src/restricted-import.ts

## License

MIT
