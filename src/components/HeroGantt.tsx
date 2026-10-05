import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

const LOOP = 12;
const DAYS = 30;
const ROW = 40;
const MONO = "'Geist Mono', monospace";

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : (1 - Math.cos(Math.PI * x)) / 2);
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const pct = (d: number) => `${(d / DAYS) * 100}%`;
const day = (d: number) => `Sep ${1 + Math.round(d)}`;

interface DemoRow {
  id: string;
  name: string;
  s: number;
  e: number;
  ms?: boolean;
}

/** Pure scripted timeline: where every bar and the cursor are at second `t` of the loop. */
function frame(t: number) {
  const drag = 3 * seg(t, 2.2, 3.4) - 3 * seg(t, 9.4, 10.0);
  const c = (i: number) =>
    3 * seg(t, 3.5 + i * 0.08, 4.1 + i * 0.08) - 3 * seg(t, 9.5 + i * 0.06, 10.1 + i * 0.06);
  const resize = 2 * seg(t, 5.6, 6.6) - 2 * seg(t, 8.6, 9.1);
  const c2 = (i: number) => 2 * seg(t, 6.75 + i * 0.08, 7.3 + i * 0.08) - 2 * seg(t, 8.7, 9.2);
  const rows: DemoRow[] = [
    { id: 'disc', name: 'Discovery', s: 0, e: 4 },
    { id: 'des', name: 'Design', s: 4 + drag, e: 9 + drag },
    { id: 'api', name: 'Build API', s: 9 + c(0), e: 16 + c(0) },
    { id: 'ui', name: 'Build UI', s: 10 + c(1), e: 17 + c(1) + resize },
    { id: 'qa', name: 'QA', s: 17 + c(2) + c2(0), e: 21 + c(2) + c2(0) },
    { id: 'launch', name: 'Launch', s: 21 + c(3) + c2(1), e: 21 + c(3) + c2(1), ms: true },
  ];
  let cx: number;
  let cy: number;
  if (t < 1) {
    cx = 16;
    cy = 5.6;
  } else if (t < 2) {
    const p = seg(t, 1, 2);
    cx = lerp(16, 6.5, p);
    cy = lerp(5.6, 1, p);
  } else if (t < 4.6) {
    cx = 6.5 + drag;
    cy = 1;
  } else if (t < 5.4) {
    const p = seg(t, 4.6, 5.4);
    cx = lerp(9.5, 19.85, p);
    cy = lerp(1, 3, p);
  } else if (t < 7.6) {
    cx = 19.85 + resize;
    cy = 3;
  } else {
    const p = seg(t, 7.6, 8.3);
    cx = lerp(21.85, 25, p);
    cy = lerp(3, 5.6, p);
  }
  const cOp = seg(t, 0.3, 0.9) - seg(t, 7.8, 8.3);
  const dragging = t > 2.1 && t < 3.45;
  const resizing = t > 5.5 && t < 6.65;
  const sel =
    t >= 1.9 && t < 4.8
      ? 'des'
      : t >= 5.3 && t < 8.2
        ? 'ui'
        : t >= 8.5 && t < 9.3
          ? 'ui'
          : t >= 9.3 && t < 10.6
            ? 'des'
            : null;
  let msg = 'Ready. 6 entries.';
  if (t >= 2.1 && t < 3.45) msg = 'Moving Design…';
  else if (t >= 3.45 && t < 5.5) msg = 'Design moved to Sep 8. 4 dependent tasks rescheduled.';
  else if (t >= 5.5 && t < 6.65) msg = 'Resizing Build UI…';
  else if (t >= 6.65 && t < 8.6) msg = 'Build UI now ends Sep 22. QA and Launch moved 2 days.';
  else if (t >= 8.6 && t < 9.4) msg = 'Undo: resize. Build UI ends Sep 20.';
  else if (t >= 9.4 && t < 11.4) msg = 'Undo: move. Design starts Sep 5 again.';
  const keys = t > 8.3 && t < 10.3;
  const keyPress = (t > 8.55 && t < 8.8) || (t > 9.35 && t < 9.6);
  return { rows, cx, cy, cOp, dragging, resizing, sel, msg, keys, keyPress, t };
}

const abs = (style: CSSProperties): CSSProperties => ({ position: 'absolute', ...style });

/** Decorative, scripted Gantt that shows a drag, a resize and an undo. Hidden from assistive tech. */
export default function HeroGantt({ speed = 1, narrow }: { speed?: number; narrow: boolean }) {
  const [t, setT] = useState(4.5);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let prev = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += ((now - prev) / 1000) * speed;
      prev = now;
      setT(acc % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const f = frame(t);
  const gridW = narrow ? 118 : 250;
  const H = f.rows.length * ROW;
  const mondays = [6, 13, 20, 27];

  const weekend = [4, 11, 18, 25].map((d) => (
    <div key={`w${d}`} style={abs({ top: 0, bottom: 0, left: pct(d), width: pct(2), background: 'var(--fg-line2)' })} />
  ));
  const vlines = mondays.map((d) => (
    <div key={`v${d}`} style={abs({ top: 0, bottom: 0, left: pct(d), width: 1, background: 'var(--fg-line)' })} />
  ));
  const rowLines = f.rows.map((_, i) => (
    <div key={`rl${i}`} style={abs({ left: 0, right: 0, top: (i + 1) * ROW - 1, height: 1, background: 'var(--fg-line2)' })} />
  ));

  const bars = f.rows.map((r, i) => {
    const on = f.sel === r.id;
    const lifted = on && ((r.id === 'des' && f.dragging) || (r.id === 'ui' && f.resizing));
    if (r.ms) {
      return (
        <div
          key={r.id}
          style={abs({ left: pct(r.s), top: i * ROW + 13, width: 14, height: 14, marginLeft: -7, transform: 'rotate(45deg)', borderRadius: 2, background: 'var(--fg-ink)' })}
        />
      );
    }
    const handle = (side: 'left' | 'right') => (
      <span
        key={side}
        style={abs({ [side]: 4, top: 5, width: 2, height: 10, borderRadius: 1, background: 'var(--fg-accent-ink)', opacity: 0.45 })}
      />
    );
    return (
      <div
        key={r.id}
        style={abs({
          left: pct(r.s),
          width: pct(r.e - r.s),
          top: i * ROW + 10,
          height: 20,
          borderRadius: 5,
          background: on ? 'var(--fg-accent)' : 'var(--fg-bar)',
          boxShadow: lifted
            ? '0 8px 18px -6px rgba(0,0,0,.45)'
            : on
              ? '0 0 0 2px var(--fg-panel), 0 0 0 3.5px var(--fg-accent)'
              : 'none',
          transform: lifted ? 'translateY(-2px)' : 'none',
          transition: 'background .2s, box-shadow .2s, transform .15s',
        })}
      >
        {on ? [handle('left'), handle('right')] : null}
      </div>
    );
  });

  const ghost =
    f.t > 2.15 && f.t < 3.6 ? (
      <div style={abs({ left: pct(4), width: pct(5), top: ROW + 10, height: 20, borderRadius: 5, border: '1.5px dashed var(--fg-muted)', opacity: 0.6 })} />
    ) : null;

  let tip: { left: string; top: number; text: string; right?: boolean } | null = null;
  if (f.dragging) {
    const r = f.rows[1];
    tip = { left: pct(r.s), top: ROW - 18, text: `${day(r.s)} – ${day(r.e - 1)}` };
  }
  if (f.resizing) {
    const r = f.rows[3];
    tip = { left: pct(r.e), top: 3 * ROW - 18, text: `Ends ${day(r.e - 1)}`, right: true };
  }
  const tipEl = tip ? (
    <div
      style={abs({ left: tip.left, top: tip.top, transform: tip.right ? 'translateX(-100%)' : 'none', padding: '3px 8px', borderRadius: 5, background: 'var(--fg-ink)', color: 'var(--fg-bg)', font: `500 11px ${MONO}`, whiteSpace: 'nowrap', zIndex: 3 })}
    >
      {tip.text}
    </div>
  ) : null;

  const pressed = f.dragging || f.resizing;
  const cursor = (
    <div
      style={abs({
        left: pct(f.cx),
        top: f.cy * ROW + 20,
        width: 18,
        height: 18,
        marginLeft: -9,
        marginTop: -9,
        borderRadius: '50%',
        border: '2px solid var(--fg-ink)',
        background: `color-mix(in oklch, var(--fg-ink) ${pressed ? 30 : 10}%, transparent)`,
        transform: pressed ? 'scale(.82)' : 'scale(1)',
        transition: 'transform .12s, background .12s',
        opacity: Math.max(0, f.cOp),
        zIndex: 4,
        pointerEvents: 'none',
      })}
    />
  );

  const today = <div style={abs({ top: 0, bottom: 0, left: pct(3.5), width: 1.5, background: 'var(--fg-accent)', opacity: 0.7 })} />;

  const cap = (txt: string) => (
    <span
      key={txt}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        height: 24,
        padding: '0 6px',
        borderRadius: 5,
        border: '1px solid var(--fg-line)',
        background: f.keyPress ? 'var(--fg-accent)' : 'var(--fg-panel)',
        color: f.keyPress ? 'var(--fg-accent-ink)' : 'var(--fg-ink)',
        boxShadow: f.keyPress ? 'none' : '0 1.5px 0 var(--fg-line)',
        transform: f.keyPress ? 'translateY(1px)' : 'none',
        font: `500 12px ${MONO}`,
        transition: 'background .1s',
      }}
    >
      {txt}
    </span>
  );

  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 44, padding: '0 16px', borderBottom: '1px solid var(--fg-line)' }}>
      <span style={{ fontWeight: 600, fontSize: 14 }}>Website relaunch</span>
      <span style={{ font: `12px ${MONO}`, color: 'var(--fg-muted)' }}>Sep 2026</span>
      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, opacity: f.keys ? 1 : 0, transition: 'opacity .25s' }}>
        {cap('⌘')}
        {cap('Z')}
        <span style={{ font: `12px ${MONO}`, color: 'var(--fg-muted)', marginLeft: 4 }}>Undo</span>
      </span>
    </div>
  );

  const headStyle: CSSProperties = {
    height: 44,
    borderBottom: '1px solid var(--fg-line)',
    font: `500 11px ${MONO}`,
    color: 'var(--fg-muted)',
    textTransform: 'uppercase',
    letterSpacing: '.04em',
  };
  const cols = narrow ? 'minmax(0,1fr)' : 'minmax(0,1fr) 62px 40px';
  const cell: CSSProperties = { font: `12px ${MONO}`, color: 'var(--fg-muted)' };

  const grid = (
    <div style={{ width: gridW, flex: 'none', borderRight: '1px solid var(--fg-line)' }}>
      <div style={{ ...headStyle, display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '0 14px', gap: 8 }}>
        <span>Task</span>
        {narrow ? null : <span>Start</span>}
        {narrow ? null : <span style={{ textAlign: 'right' }}>Days</span>}
      </div>
      {f.rows.map((r) => (
        <div
          key={r.id}
          style={{ height: ROW, display: 'grid', gridTemplateColumns: cols, alignItems: 'center', gap: 8, padding: '0 14px', borderBottom: '1px solid var(--fg-line2)', background: f.sel === r.id ? 'var(--fg-accent-soft)' : 'transparent', transition: 'background .2s', fontSize: 13.5 }}
        >
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: f.sel === r.id ? 600 : 400 }}>{r.name}</span>
          {narrow ? null : <span style={cell}>{day(r.s)}</span>}
          {narrow ? null : <span style={{ ...cell, textAlign: 'right' }}>{r.ms ? '—' : String(Math.round(r.e - r.s))}</span>}
        </div>
      ))}
    </div>
  );

  const timeline = (
    <div style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ ...headStyle, position: 'relative' }}>
        <div style={abs({ left: 12, top: 6, textTransform: 'none', letterSpacing: 0, color: 'var(--fg-ink)', fontSize: 12 })}>September</div>
        {mondays.map((d) => (
          <div key={`m${d}`} style={abs({ left: pct(d), bottom: 6, paddingLeft: 6, borderLeft: '1px solid var(--fg-line)', lineHeight: '14px' })}>
            {d + 1}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', height: H }}>
        {weekend}
        {vlines}
        {rowLines}
        {today}
        {ghost}
        {bars}
        {tipEl}
        {cursor}
      </div>
    </div>
  );

  const status = (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 16px', borderTop: '1px solid var(--fg-line)', font: `12px ${MONO}`, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-accent)', flex: 'none' }} />
      {narrow ? null : <span style={{ color: 'var(--fg-ink)' }}>aria-live</span>}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.msg}</span>
    </div>
  );

  return (
    <div aria-hidden="true" style={{ userSelect: 'none' }}>
      {toolbar}
      <div style={{ display: 'flex' }}>
        {grid}
        {timeline}
      </div>
      {status}
    </div>
  );
}

/** Minimal keyword/string/comment colouring for the landing page snippets. */
export function highlight(src: string): ReactNode[] {
  const re = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(import|from|export|const|let|new|return|function|true|false)\b/g;
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const style: CSSProperties = m[1]
      ? { color: 'var(--fg-muted)' }
      : m[2]
        ? { color: 'var(--fg-accent-text)' }
        : { color: 'var(--fg-ink)', fontWeight: 600 };
    out.push(<span key={k++} style={style}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}
