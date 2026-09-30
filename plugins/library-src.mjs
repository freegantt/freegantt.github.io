// The library checkout the site builds from: its `docs/` are the pages and its `src/api` is the
// API reference. CI checks it out at `vendor/freegantt`; locally, point FREEGANTT_SRC at a clone.

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function resolveLibraryRoot() {
  const named = [process.env.FREEGANTT_SRC, path.join(SITE_ROOT, 'vendor/freegantt')];
  const found = named.find(
    (candidate) => candidate && existsSync(path.join(candidate, 'src/api/index.ts')),
  );
  if (!found) {
    throw new Error(
      'The FreeGantt library checkout is missing. Set FREEGANTT_SRC to a clone of ' +
        'freegantt/freegantt, or clone it to vendor/freegantt.',
    );
  }
  return path.resolve(found);
}

export const libraryRoot = resolveLibraryRoot();
export const libraryDocs = path.join(libraryRoot, 'docs');
