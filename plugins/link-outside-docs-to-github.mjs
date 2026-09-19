// Docusaurus resolves a relative link between two published pages by itself. It cannot resolve a
// link that leaves `docs/` — `plans/`, `CONTEXT.md`, `README.md` — because those files live in the
// library repository. This re-aims those links at the file on GitHub.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const BLOB_BASE = 'https://github.com/freegantt/freegantt/blob/main/';
const API_REFERENCE_ROUTE = '/api/';

function eachLink(node, visit) {
  if (node.type === 'link') visit(node);
  for (const child of node.children ?? []) eachLink(child, visit);
}

function splitAnchor(target) {
  const hash = target.indexOf('#');
  return hash === -1 ? [target, ''] : [target.slice(0, hash), target.slice(hash)];
}

function siteServes(resolved) {
  return resolved === DOCS_DIR || resolved.startsWith(DOCS_DIR + path.sep);
}

function isExportList(resolved) {
  return resolved.split(path.sep).join('/').endsWith('/etc/freegantt.api.md');
}

export default function linkOutsideDocsToGitHub() {
  return (tree, file) => {
    const sourceDir = path.dirname(file.path);
    eachLink(tree, (link) => {
      const target = link.url;
      if (!target) return;
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#') || target.startsWith('/'))
        return;

      const [filePart, anchor] = splitAnchor(target);
      if (!filePart) return;

      const resolved = path.resolve(sourceDir, filePart);
      if (isExportList(resolved)) {
        link.url = `${API_REFERENCE_ROUTE}${anchor}`;
        return;
      }
      if (siteServes(resolved)) return;

      link.url = BLOB_BASE + path.relative(REPO_ROOT, resolved).split(path.sep).join('/') + anchor;
    });
  };
}
