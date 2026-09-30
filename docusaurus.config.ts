import path from 'node:path';

import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import linkOutsideDocsToGitHub from './plugins/link-outside-docs-to-github.mjs';
import { libraryDocs, libraryRoot } from './plugins/library-src.mjs';

/** True for an ADR. Thirteen of them open with a `status:`/`decided:`/`open:` block that a reader
 *  sees on the page. It is prose between two rules, it is not YAML, and it is not front matter. */
function isDecisionRecord(filePath: string): boolean {
  return filePath.split(path.sep).join('/').includes('/docs/adr/');
}


const config: Config = {
  title: 'FreeGantt',
  tagline: 'A framework-free TypeScript Gantt and timeline library',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://freegantt.dev',
  baseUrl: '/',

  organizationName: 'freegantt',
  projectName: 'freegantt.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: libraryDocs,
          sidebarPath: './sidebars.ts',
          beforeDefaultRemarkPlugins: [linkOutsideDocsToGitHub],
          editUrl: ({ docPath }) =>
            `https://github.com/freegantt/freegantt/blob/main/docs/${docPath}`,
          routeBasePath: 'docs',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/architecture-doc.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
    parseFrontMatter: async (params) => {
      if (isDecisionRecord(params.filePath)) {
        return { frontMatter: {}, content: params.fileContent };
      }
      const parsed = await params.defaultParseFrontMatter(params);
      // The library's overview claims `slug: /`; the home page here is src/pages/index.tsx.
      const { slug: _slug, ...frontMatter } = parsed.frontMatter;
      return { ...parsed, frontMatter };
    },
  },

  plugins: [
        [
          '@docusaurus/plugin-content-docs',
          {
            id: 'api',
            path: 'generated/api',
            routeBasePath: 'api',
            sidebarPath: './sidebars-api.ts',
          },
        ],
        [
          'docusaurus-plugin-typedoc',
          {
            entryPoints: [path.join(libraryRoot, 'src/api/index.ts')],
            tsconfig: './tsconfig.typedoc.json',
            out: 'generated/api',
            sidebar: false,
            readme: 'none',
            skipErrorChecking: true, // the library's own CI type-checks it
            excludeExternals: true,
            excludePrivate: true,
            excludeProtected: true,
          },
        ],
    ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'FreeGantt',
      logo: {
        alt: 'FreeGantt',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/', label: 'Home', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'architectureSidebar',
          position: 'left',
          label: 'Architecture',
        },
        {
          type: 'docSidebar',
          sidebarId: 'adrSidebar',
          position: 'left',
          label: 'ADRs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          docsPluginId: 'api',
          position: 'left',
          label: 'API reference',
        },
        {
          href: 'https://github.com/freegantt/freegantt',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Guides', to: '/docs/guardrails-overview' },
            { label: 'ADRs', to: '/docs/adr/' },
            { label: 'API reference', to: '/api/' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/freegantt/freegantt' },
            { label: 'npm', href: 'https://www.npmjs.com/package/freegantt' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FreeGantt.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
