// Builds the library's harness demo pages into `build/demo/`, after Docusaurus has written `build/`.
// The harness is the library's own consumer, so the demo is always the current `main`. Only the
// pages in SHIPPED_PAGES are kept and linked; the site serves Generic at `/demo/`.

import { spawnSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { libraryRoot } from '../plugins/library-src.mjs';

const SHIPPED_PAGES = ['generic-demo', 'performance'];
const DROPPED_FILES = ['index.html', 'editing-and-data.html', 'hierarchy-and-timeline.html'];

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../build/demo');

const result = spawnSync('pnpm', ['exec', 'vite', 'build', '--base', '/demo/', '--outDir', outDir], {
  cwd: libraryRoot,
  stdio: 'inherit',
  env: { ...process.env, VITE_HARNESS_PAGES: SHIPPED_PAGES.join(',') },
});
if (result.status !== 0) process.exit(result.status ?? 1);

for (const file of DROPPED_FILES) rmSync(path.join(outDir, file));
writeFileSync(
  path.join(outDir, 'index.html'),
  '<!doctype html><meta charset="utf-8"><title>FreeGantt demo</title>' +
    '<meta http-equiv="refresh" content="0; url=./generic.html">' +
    '<link rel="canonical" href="./generic.html">\n',
);
