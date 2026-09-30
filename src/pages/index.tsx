import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Framework-free TypeScript Gantt"
      description="FreeGantt is a framework-free TypeScript Gantt and timeline library. You own the data. The library draws the chart."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>npm install freegantt</p>
          <h1 className={styles.title}>A Gantt that stays out of your framework.</h1>
          <p className={styles.lede}>
            FreeGantt is a TypeScript library. You pass dated entries. It draws a timeline. There is
            no React, Vue, or Angular lock-in. Theme it with CSS. Extend it with plugins.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/docs/consumer-api">
              Read the consumer API
            </Link>
            <Link className={styles.secondary} to="pathname:///demo/">
              Try the live demo
            </Link>
            <Link className={styles.secondary} to="/docs/plugin-authoring">
              Write a plugin
            </Link>
            <code className={styles.install}>npm install freegantt</code>
          </div>
          <video
            className={styles.demo}
            src={useBaseUrl('/img/video.mp4')}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="FreeGantt demo: a Gantt chart being edited"
          />
        </section>
        <section className={styles.points}>
          <div className={styles.point}>
            <h2>One Dataset, one Gantt</h2>
            <p>
              Wrap entries in a Dataset with an IANA time zone. Mount a Gantt on a DOM node. Destroy
              it when the page leaves.
            </p>
          </div>
          <div className={styles.point}>
            <h2>Edits are ordinary calls</h2>
            <p>
              Call <code>dataset.entries.update</code> with the field you changed. Undo and redo ride
              the same change event. There is no second render path.
            </p>
          </div>
          <div className={styles.point}>
            <h2>Scheduling is a plugin</h2>
            <p>
              Core names dated records. Your app names what they are for. Dependencies and lag stay
              in the scheduling plugin, not in the base types.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
