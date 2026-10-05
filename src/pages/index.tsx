import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import HeroGantt, { highlight } from '../components/HeroGantt';
import styles from './index.module.css';

const LT = '\x3c';

const CODE = {
  vanilla: `import { Gantt, Dataset } from 'freegantt';

const dataset = new Dataset({
  timeZone: 'America/Chicago',
  entries: [
    { id: 't1', name: 'Design', start: '2026-09-01', end: '2026-09-07' },
    { id: 't2', name: 'Build',  start: '2026-09-08', end: '2026-09-21' },
    { id: 't3', name: 'QA',     start: '2026-09-22', end: '2026-09-28' },
  ],
});

const gantt = new Gantt({ container: '#gantt', dataset });

// Edits are plain calls. The chart redraws on the next frame.
dataset.entries.update('t2', { end: '2026-09-24' });
dataset.undo();`,
  react: `import { useEffect, useRef } from 'react';
import { Gantt } from 'freegantt';

export function Timeline({ dataset }) {
  const ref = useRef(null);

  useEffect(() => {
    const gantt = new Gantt({ container: ref.current, dataset });
    return () => gantt.destroy();
  }, [dataset]);

  return <div ref={ref} style={{ height: 480 }} />;
}`,
  vue: `${LT}script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Gantt } from 'freegantt';

const props = defineProps(['dataset']);
const el = ref(null);
let gantt;

onMounted(() => {
  gantt = new Gantt({ container: el.value, dataset: props.dataset });
});
onBeforeUnmount(() => gantt.destroy());
${LT}/script>

<template>
  <div ref="el" style="height: 480px" />
</template>`,
  svelte: `${LT}script>
  import { onMount } from 'svelte';
  import { Gantt } from 'freegantt';

  export let dataset;
  let el;

  onMount(() => {
    const gantt = new Gantt({ container: el, dataset });
    return () => gantt.destroy();
  });
${LT}/script>

<div bind:this={el} style="height: 480px"></div>`,
};

type Tab = keyof typeof CODE;
const TABS: [Tab, string][] = [
  ['vanilla', 'Vanilla'],
  ['react', 'React'],
  ['vue', 'Vue'],
  ['svelte', 'Svelte'],
];

const PLUGIN_CODE = `import { Gantt, tooltips, contextMenu, definePlugin } from 'freegantt';

// Paint a stripe behind every row that is running late.
const highlightLate = definePlugin({
  id: 'app.highlightLate',
  view(ctx) {
    ctx.view.registerDecoration('underBars', ({ rows }) =>
      rows
        .filter((row) => isLate(row.entryIds[0]))
        .map((row) => ({ kind: 'rowStripe', rowId: row.id, class: 'late' })),
    );
  },
});

new Gantt({
  container,
  dataset,
  plugins: [tooltips(), contextMenu(), highlightLate],
});`;

const STACKS = ['React', 'Vue', 'Svelte', 'Angular', 'Solid', 'Lit', 'plain HTML'];

const ACCESSIBILITY = [
  ['Keyboard', 'Move, resize, reorder, edit', 'Every task, every gesture, no pointer required.'],
  ['Screen readers', 'ARIA grid and tree grid', 'Flat lists read as a grid. Nested plans read as a tree grid.'],
  ['Feedback', 'Announced refusals', 'When an edit is blocked, a live region says so.'],
  ['CI', 'axe on every demo page', 'Automated checks run in each built-in theme, not only the default.'],
];

const PLUGINS = [
  ['tooltips()', 'Hover details'],
  ['contextMenu()', 'Right-click actions'],
  ['inlineEditing()', 'Edit cells in the grid'],
  ['timeShading()', 'Weekends and closed time'],
];

const STATS = [
  ['50,000', 'entries in a single chart in the performance demo'],
  ['0', 'framework dependencies. Plugins you skip are never bundled.'],
  ['3', 'browser engines tested in CI: Chromium, Firefox and WebKit'],
];

const FEATURES = [
  ['MIT licensed', 'Use it in commercial products. No seats, no license keys.'],
  ['Undo and redo', 'Built into the Dataset. Transactions undo as one step.'],
  ['IANA time zones', 'Set a zone per dataset so every viewer sees the same day boundaries.'],
  ['Tree rows and roll-ups', 'Parents roll up from their children. Group or filter rows live.'],
  ['Drag with snapping', 'Smooth preview while dragging, snapped on release. Hold Alt to place freely.'],
  ['Server-friendly events', 'Save on change, or veto a move with an async before-handler.'],
  ['Light and dark themes', 'Follows the OS by default. Override any CSS custom property.'],
  ['Shared time axis', 'Two Gantts can share one scale and scroll position.'],
];

function InstallButton({ large }: { large?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    navigator.clipboard?.writeText('npm install freegantt').catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" className={large ? styles.installLarge : styles.install} onClick={copy}>
      <span>
        <span className={styles.dim}>$ </span>npm install freegantt
      </span>
      <span className={styles.copy}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function Eyebrow({ children }: { children: string }) {
  return <div className={styles.eyebrow}>{children}</div>;
}

export default function Home(): ReactElement {
  const [tab, setTab] = useState<Tab>('vanilla');
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 720);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const tabCode = useMemo(() => highlight(CODE[tab]), [tab]);
  const pluginCode = useMemo(() => highlight(PLUGIN_CODE), []);

  return (
    <Layout
      title="Framework-free TypeScript Gantt"
      description="FreeGantt is a framework-free TypeScript Gantt and timeline library. You own the data. The library draws the chart."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badges}>
            <span className={styles.badge}>Open source</span>
            <span className={styles.badge}>MIT</span>
            <span className={styles.badge}>TypeScript</span>
          </div>
          <h1 className={styles.title}>An MIT-licensed Gantt chart for every stack.</h1>
          <div className={styles.heroRow}>
            <p className={styles.heroLede}>
              FreeGantt is a TypeScript timeline library with no framework dependency. Mount it in a div
              from React, Vue, Svelte, Angular or plain HTML. Style it with CSS variables and extend it
              with plugins.
            </p>
            <div className={styles.actions}>
              <InstallButton />
              <Link className={styles.cta} to="pathname:///demo/">
                Open the live demo →
              </Link>
            </div>
          </div>
          <div className={styles.demoFrame}>
            <HeroGantt narrow={narrow} />
          </div>
          <div className={styles.stacks}>
            <span>Mounts into any element from</span>
            {STACKS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${styles.wrap} ${styles.split}`}>
            <div>
              <Eyebrow>01 / QUICK START</Eyebrow>
              <h2 className={styles.h2}>Three steps from install to chart.</h2>
              <p className={styles.lead}>
                The library code is the same in every framework. Only the element you mount into changes.
              </p>
              <ol className={styles.steps}>
                <li>
                  <span className={styles.stepNo}>1</span>
                  <span>
                    Install <code>freegantt</code> from npm.
                  </span>
                </li>
                <li>
                  <span className={styles.stepNo}>2</span>
                  <span>
                    Put your dated entries in a <code>Dataset</code>. Ids and dates are plain strings.
                  </span>
                </li>
                <li>
                  <span className={styles.stepNo}>3</span>
                  <span>
                    Mount a <code>Gantt</code> on an element. Call <code>destroy()</code> when the view goes
                    away.
                  </span>
                </li>
              </ol>
            </div>
            <div className={styles.codePanel}>
              <div role="tablist" className={styles.tabs}>
                {TABS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    className={tab === id ? styles.tabActive : styles.tab}
                    onClick={() => setTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <pre className={styles.preTall}>{tabCode}</pre>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${styles.wrap} ${styles.split}`}>
            <div>
              <Eyebrow>02 / ACCESSIBILITY</Eyebrow>
              <h2 className={styles.h2}>Every edit works without a mouse.</h2>
              <p className={styles.lead}>
                Gantt charts are usually the least accessible part of a planning app. FreeGantt treats
                keyboard and screen reader users as first-class from the core up, and checks it on every
                change.
              </p>
            </div>
            <div className={styles.cells}>
              {ACCESSIBILITY.map(([label, title, text]) => (
                <div key={label} className={styles.cell}>
                  <div className={styles.cellLabel}>{label}</div>
                  <div className={styles.cellTitle}>{title}</div>
                  <div className={styles.cellText}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${styles.wrap} ${styles.split}`}>
            <div>
              <Eyebrow>03 / PLUGINS</Eyebrow>
              <h2 className={styles.h2}>The core draws the chart. Plugins add the rest.</h2>
              <p className={styles.lead} style={{ marginBottom: 32 }}>
                Four plugins ship with the package. Leave one out and it stays out of your bundle. Write
                your own to paint bands behind or over the bars, add menus, or attach data behavior.
              </p>
              <div className={styles.plugins}>
                {PLUGINS.map(([name, text]) => (
                  <div key={name} className={styles.plugin}>
                    <code>{name}</code>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <Link className={styles.textLink} to="/docs/plugin-authoring">
                Plugin authoring guide →
              </Link>
            </div>
            <div className={styles.codePanel}>
              <div className={styles.fileName}>highlight-late.ts</div>
              <pre className={styles.pre}>{pluginCode}</pre>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <Eyebrow>04 / PERFORMANCE</Eyebrow>
            <div className={styles.headRow}>
              <h2 className={styles.h2}>Built for plans with real size.</h2>
              <Link className={styles.textLink} style={{ margin: 0 }} to="pathname:///demo/performance.html">
                Open the performance demo →
              </Link>
            </div>
            <div className={styles.stats}>
              {STATS.map(([value, text]) => (
                <div key={value} className={styles.stat}>
                  <div className={styles.statNo}>{value}</div>
                  <div className={styles.statText}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <Eyebrow>05 / FEATURES</Eyebrow>
            <h2 className={styles.h2} style={{ marginBottom: 48, maxWidth: '20ch' }}>
              What you get in the box.
            </h2>
            <div className={styles.cellsWide}>
              {FEATURES.map(([feature, text]) => (
                <div key={feature} className={styles.cell}>
                  <div className={styles.cellTitle} style={{ fontWeight: 600, marginBottom: 8 }}>
                    {feature}
                  </div>
                  <div className={styles.cellText}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <Eyebrow>06 / DEMOS</Eyebrow>
            <h2 className={styles.h2} style={{ marginBottom: 48, maxWidth: '20ch' }}>
              Try it before you install it.
            </h2>
            <div className={styles.cards}>
              <Link className={styles.card} to="pathname:///demo/">
                <span className={styles.cardPath}>/demo</span>
                <span className={styles.cardTitle}>Planner</span>
                <span className={styles.cellText}>
                  The full demo: tree rows, roll-ups, editing and undo, built only on the public API.
                </span>
                <span className={styles.cardThemes}>
                  {['Light', 'Dark', 'Paper'].map((name) => (
                    <span key={name} className={styles.badge}>
                      {name}
                    </span>
                  ))}
                </span>
              </Link>
              <Link className={styles.card} to="pathname:///demo/generic.html">
                <span className={styles.cardPath}>/demo/generic</span>
                <span className={styles.cardTitle}>Generic</span>
                <span className={styles.cellText}>
                  The smallest setup, with controls for snapping, zoom and row sources.
                </span>
                <span className={styles.cardOpen}>Open →</span>
              </Link>
              <Link className={styles.card} to="pathname:///demo/performance.html">
                <span className={styles.cardPath}>/demo/performance</span>
                <span className={styles.cardTitle}>Performance</span>
                <span className={styles.cellText}>
                  Fifty thousand entries. Scroll, zoom and drag to see how it holds up.
                </span>
                <span className={styles.cardOpen}>Open →</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.closing}>
            <h2>Your data. Your framework. Our chart.</h2>
            <div className={styles.actions}>
              <InstallButton large />
              <Link className={styles.ctaDark} to="https://github.com/freegantt/freegantt">
                Star on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
