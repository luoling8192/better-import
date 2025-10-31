# better-import

CLI tool to detect replaceable dependencies in your package.json files. Automatically scans monorepo workspaces and suggests better, lighter, or more performant alternatives.

## Features

- 🔍 **Auto-detect workspaces**: Reads `workspaces` field from package.json (supports npm/yarn/pnpm)
- 📦 **Query mode**: Check if a specific dependency has better alternatives
- 🎨 **Multiple output formats**: Human-readable table or JSON for CI/CD integration
- ⚡ **Fast & lightweight**: Uses curated rules from industry best practices

## Installation

```bash
pnpm install
pnpm build
```

## Usage

### Check all packages in monorepo

```bash
pnpm dev check
```

Output:
```
Package         │ Version │ Suggestion                                      │ Source
────────────────┼─────────┼─────────────────────────────────────────────────┼─────────────────────
axios           │ ^1.0.0  │ Use https://www.npmjs.com/package/ky instead.   │ /path/to/package.json
lodash          │ ^4.17.0 │ Use https://es-toolkit.slash.page instead.      │ /path/to/package.json

Found 2 package(s) with better alternatives
```

### Query specific package

```bash
pnpm dev query axios
```

Output:
```
axios
───────────────────────
Use https://www.npmjs.com/package/ky instead.
```

### JSON output

```bash
pnpm dev check --json
pnpm dev query lodash --json
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

The replacement rules are based on [`src/better-import.ts`](./src/better-import.ts), which maintains a curated list of common dependencies and their better alternatives.

## Architecture

Built with [oclif](https://oclif.io/) - A framework for building CLIs in Node.js.

```
src/
├── commands/
│   ├── check.ts         # Check command
│   └── query.ts         # Query command
├── better-import.ts # Curated rules for better alternatives
├── scanner.ts          # Scans package.json files in monorepo
├── checker.ts          # Checks dependencies against rules
├── formatter.ts        # Formats output (table/JSON)
└── cli.ts             # CLI entry point (oclif)
```

## Technology Stack

- **Framework**: [oclif](https://oclif.io/) - Professional CLI framework
- **Language**: TypeScript with ESM
- **Testing**: Vitest
- **Dependencies**:
  - `@oclif/core` - CLI framework
  - `picocolors` - Terminal colors
  - `fast-glob` - Fast file globbing

## License

MIT
