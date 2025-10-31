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

## Rules Source

The replacement rules are based on [`src/rules/`](./src/rules/), which maintains curated lists of common dependencies and their better alternatives from industry best practices.

### Sukka

https://github.com/SukkaW/eslint-config-sukka/blob/308947197c4d06d7261a5fab5c81257e79a6133e/packages/shared/src/restricted-import.ts

## License

MIT
