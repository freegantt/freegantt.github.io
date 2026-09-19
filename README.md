# FreeGantt docs

Public documentation site for [FreeGantt](https://github.com/freegantt/freegantt). Docusaurus builds
the site. Vercel can host it.

## Local

This folder is a pnpm project of its own.

```bash
pnpm install
pnpm start
```

The home page is `src/pages/index.tsx`. Guides, architecture, and ADRs live in `docs/`.

The API reference is generated from the library source when `FREEGANTT_SRC` is set, or when
`vendor/freegantt` exists. If neither is present, the site still builds and the API nav item is
absent. That is the Vercel default until you add a checkout.

```bash
pnpm build
```

## Vercel

Import `freegantt/docs`. Root directory is the repository root. Framework preset is Docusaurus.
Set the production URL in `docusaurus.config.ts` (`url`) when the custom domain is ready.

To generate the API reference on Vercel, add the library as a git submodule at `vendor/freegantt`,
or set `FREEGANTT_SRC` in the build environment to a checkout the build can read.

## Sync with the library

`docs/` here started as a copy of `freegantt/docs`. The library still holds that folder for agents
and for `pnpm docs` in the library checkout. When a page changes, copy it here or the two trees
drift.
