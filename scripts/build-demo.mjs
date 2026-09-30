// Builds the library's harness demo pages into `build/demo/`, after Docusaurus has written `build/`.
// The harness is the library's own consumer, so the demo is always the current `main`.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { libraryRoot } from '../plugins/library-src.mjs';

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../build/demo');

const result = spawnSync('pnpm', ['exec', 'vite', 'build', '--base', '/demo/', '--outDir', outDir], {
  cwd: libraryRoot,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
