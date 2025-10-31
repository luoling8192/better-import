/**
 * 福妮严选
 * https://github.com/SukkaW/eslint-config-sukka/blob/master/packages/shared/src/restricted-import.ts
 */

// Since both eslint-sukka/node and eslint-config-sukka requires these, they have to live in shared.

const npm = (pkgName: string) => `https://www.npmjs.com/package/${pkgName}`

export const BETTER_ALTERNATIVES = Object.entries({
  // deep equal
  'deep-equal': npm('dequal'),
  'fast-deep-equal': npm('dequal'),
  // ansi color / cursor
  'chalk': `simple color ${npm('picocolors')}, hex color or chain ${npm('ansis')}`,
  'kleur': npm('picocolors'),
  'ansi-escapes': npm('sisteransi'),
  // mime
  'mime-db': npm('mrmime'),
  'mime-types': npm('mrmime'),
  // lru
  'lru-cache': `w/o TTL ${npm('flru')}, w/ TTL TTL: ${npm('tiny-lru')}`,
  'tmp-cache': `w/o TTL ${npm('flru')}, w/ TTL TTL: ${npm('tiny-lru')}`,
  // fs operations
  'premove': 'Node.js built-in fs.rmdir & fs.rm API',
  'rimraf': 'Node.js built-in fs.rmdir & fs.rm API',
  'mkdirp': 'Node.js built-in fs.mkdir API',
  'make-dir': 'Node.js built-in fs.mkdir API',
  'mk-dirs': 'Node.js built-in fs.mkdir API',
  // network
  'axios': npm('ky'),
  'node-fetch': npm('undici'),
  'got': `${npm('undici')} and foxts/async-retry`,
  'get-port': npm('get-port-please'),
  // react
  'react-query': 'https://swr.vercel.app',
  '@tanstack/react-query': 'https://swr.vercel.app',
  '@tanstack/react-query-devtools': 'https://swr.vercel.app',
  'ahooks': 'https://foxact.skk.moe and https://swr.vercel.app',
  // deep clone
  'clone-deep': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'deep-copy': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'fast-copy': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'lodash.clonedeep': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  'clone': `${npm('rfdc')} for Node.js / ${npm('klona')} for Browser`,
  // escape string regexp
  'escape-string-regexp': npm('fast-escape-regexp'),
  'escape-regexp': npm('fast-escape-regexp'),
  'lodash.escaperegexp': npm('fast-escape-regexp'),
  'regex-escape': npm('fast-escape-regexp'),
  // esacpe html
  'escape-html': npm('fast-escape-html'),
  'html-escaper': npm('fast-escape-html'),
  'escape-goat': npm('fast-escape-html'),
  'lodash.escape': npm('fast-escape-html'),
  // React i18n
  'next-intl': 'https://github.com/QuiiBz/next-international',
  'next-i18next': 'https://github.com/QuiiBz/next-international',
  // React Virtual Scroll
  'react-virtuoso': npm('virtua'),
  '@tanstack/react-virtual': npm('virtua'),
  '@tanstack/solid-virtual': npm('virtua'),
  '@tanstack/svelte-virtual': npm('virtua'),
  '@tanstack/vue-virtual': npm('virtua'),
  '@tanstack/lit-virtual': npm('virtua'),
  '@tanstack/angular-virtual': npm('virtua'),
  '@tanstack/virtual-core': npm('virtua'),
  // misc
  'ms': npm('@lukeed/ms'),
  'classnames': npm('clsx'),
  'classcat': npm('clsx'),
  'p-limit': `${npm('superlock')} / ${npm('@henrygd/queue')} / ${npm('async-sema')} / ${npm('@livekit/mutex')}`,
  'p-mutex': npm('@livekit/mutex'),
  'p-queue': npm('@henrygd/queue'),
  'is-network-error': `${npm('foxts')}, foxts/is-network-error`,
  'p-retry': 'foxts/async-retry',
  'async-retry': 'foxts/async-retry',
  'ora': npm('nanospinner'),
  'ts-results': npm('ts-results-es'),
  'dayjs': npm('date-fns'),
  'tldjs': npm('tldts'),
  'types-package-json': npm('@package-json/types'),
  'xxhash-wasm': `${npm('hash-wasm')}, significantly faster`,
  'string-width': npm('fast-string-width'),
  'lodash': 'https://es-toolkit.slash.page',
  'jszip': `${npm('client-zip')} / ${npm('fflate')}`,

  'cidr-tools': npm('fast-cidr-tools'),
  'eventemitter3': `${npm('mitt')}. Node.js' "eventemitter" could be slow, "eventemitter2" is not tiny/performant but it is feature rich. But "eventemitter3" has no reasons to be used`,
  'fnv1a': `${npm('foxts')}, foxts/fnv1a is 6x faster`,
  '@sindresorhus/fnv1a': `${npm('foxts')}, foxts/fnv1a is 6x faster`,
}).map(([key, value]) => ({ name: key, message: `Use ${value} instead.` }))

const restricedImportBase = [
  { name: 'date-fns/esm', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'idb/with-async-ittr-cjs', message: 'Please use idb/with-async-ittr instead.' },
  { name: 'lodash-unified', message: 'Do not import lodash-unified directly' },
  { name: 'react-fast-compare', message: 'What\'s faster than a really fast deep comparison? No deep comparison at all.' },
]

/** eslint-plugin-n/no-restricted-require doesn't support "importNames" */
const restrictedImportWithImportNames = [
  { name: 'lodash', message: 'Avoid using type unsafe methods.', importNames: ['get'] },
  { name: 'lodash-es', message: 'Avoid using type unsafe methods.', importNames: ['get'] },
  { name: 'lodash', message: `Use ${npm('rfdc')} for Node.js / ${npm('klona')} for Browser instead`, importNames: ['cloneDeep'] },
  { name: 'lodash-es', message: `Use ${npm('rfdc')} for Node.js / ${npm('klona')} for Browser instead`, importNames: ['cloneDeep'] },
  { name: 'uuid', importNames: ['v4'], message: `Use ${npm('@lukeed/uuid')} instead` },
  { name: 'assert', importNames: ['deepEqual'], message: `Use ${npm('dequal')} instead` },
  { name: 'react', importNames: ['useLayoutEffect'], message: 'Use https://foxact.skk.moe/use-isomorphic-layout-effect instead' },
]

export const RESTRICTED_IMPORT_JS = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.' },
  { name: 'react', importNames: ['default'], message: 'Use named import instead' },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
  ...restrictedImportWithImportNames,
]

export const RESTRICTED_IMPORT_TS = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.', allowTypeImports: true },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.', allowTypeImports: true },
  { name: 'react', importNames: ['default'], message: 'Use named import instead', allowTypeImports: true },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
  ...restrictedImportWithImportNames,
]

export const RESTRICTED_IMPORT_NODE_REQUIRE = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.' },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
]
