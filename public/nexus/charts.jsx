/* Reusable: CountUp number, useCountUp hook, donut chart, bar chart, skeletons */

function useCountUp(target, { duration = 1200, start = 0 } = {}) {
  const [val, setVal] = React.useState(start);
  React.useEffect(() => {
    if (target == null || isNaN(target)) { setVal(0); return; }
    const t0 = performance.now();
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(start + (target - start) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function CountUp({ value, format = window.GH.commaNum, duration = 1100 }) {
  const v = useCountUp(value ?? 0, { duration });
  return <>{format(v)}</>;
}

function StatCard({ label, value, sub, accent = 'var(--neon-cyan)', icon, delay = 0 }) {
  return (
    <div className="stat-card fade-up" style={{ '--accent': accent, animationDelay: delay + 's' }}>
      <div className="label">
        <span>{label}</span>{icon ? icon : null}
      </div>
      <div className="value"><CountUp value={value} /></div>
      {sub ? <div className="sub">{sub}</div> : null}
      <div className="blip" />
    </div>
  );
}

/* ------------------------------------------------------------ */
function DonutChart({ data }) {
  const [hover, setHover] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const R = 70, C = 2 * Math.PI * R;
  let acc = 0;
  const segs = data.map((d, i) => {
    const len = (d.pct / 100) * C;
    const seg = { ...d, len, off: acc, idx: i, color: window.GH.langColor(d.name) };
    acc += len;
    return seg;
  });

  const wrapRef = React.useRef(null);
  function moveTip(e) {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
  }
  const [tip, setTip] = React.useState({ x: 0, y: 0 });

  const total = data.length;

  return (
    <div className="donut-wrap">
      <div className="donut" ref={wrapRef} onMouseMove={moveTip}>
        <svg viewBox="0 0 200 200">
          <defs>
            {segs.map((s) => (
              <filter key={s.name} id={`glow-${s.idx}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>
          <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(168,175,255,.08)" strokeWidth="22" />
          {segs.map((s) => (
            <circle
              key={s.name}
              cx="100" cy="100" r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === s.idx ? 26 : 22}
              strokeDasharray={`${mounted ? s.len : 0} ${C}`}
              strokeDashoffset={-s.off}
              strokeLinecap="butt"
              filter={`url(#glow-${s.idx})`}
              style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1), stroke-width .2s, opacity .2s', opacity: hover != null && hover !== s.idx ? 0.35 : 1, cursor: 'pointer' }}
              onMouseEnter={() => setHover(s.idx)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="center">
          <div>
            <div className="big">{total}</div>
            <div className="small">Languages</div>
          </div>
        </div>
        {hover != null && (
          <div className="donut-tooltip visible" style={{ left: tip.x, top: tip.y }}>
            <span style={{ color: segs[hover].color, marginRight: 6 }}>●</span>
            {segs[hover].name} · {segs[hover].pct.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="donut-legend">
        {segs.map((s) => (
          <div key={s.name} className="lang-row"
            onMouseEnter={() => setHover(s.idx)} onMouseLeave={() => setHover(null)}>
            <span className="swatch" style={{ background: s.color, color: s.color }} />
            <span className="name">{s.name}</span>
            <span className="pct">{s.pct.toFixed(1)}%</span>
          </div>
        ))}
        {segs.length === 0 && <div className="lang-row" style={{ color: 'var(--ink-faint)' }}>No language data</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
function BarChart({ buckets }) {
  const max = Math.max(1, ...buckets.map(b => b.count));
  // re-mount key so it re-animates
  const keyStr = buckets.map(b => b.count).join(',');
  return (
    <>
      <div className="bars" key={keyStr}>
        {buckets.map((b, i) => {
          const h = b.count === 0 ? 6 : 8 + (b.count / max) * 142;
          return (
            <div
              key={i}
              className={b.count === 0 ? 'bar empty' : 'bar'}
              style={{
                height: h,
                animationDelay: (i * 0.04) + 's',
                background: b.count === 0 ? undefined :
                  `linear-gradient(180deg, var(--neon-cyan), ${b.count / max > 0.7 ? 'var(--neon-pink)' : 'var(--neon-violet)'})`,
              }}
              data-count={`${b.count} event${b.count === 1 ? '' : 's'} · ${b.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
            />
          );
        })}
      </div>
      <div className="bars-x">
        {buckets.map((b, i) => {
          const d = b.date;
          const show = i === 0 || i === buckets.length - 1 || i === Math.floor(buckets.length / 2);
          return <span key={i}>{show ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '·'}</span>;
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------ */
function Skeleton({ w = '100%', h = 16, r = 8, style = {} }) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

function ProfileSkeleton() {
  return (
    <div className="card profile-card">
      <Skeleton w="132px" h="132px" r="50%" style={{ alignSelf: 'center' }} />
      <Skeleton w="60%" h="22" style={{ alignSelf: 'center' }} />
      <Skeleton w="40%" h="14" style={{ alignSelf: 'center' }} />
      <Skeleton h="14" />
      <Skeleton w="85%" h="14" />
      <Skeleton w="70%" h="14" />
      <Skeleton w="50%" h="14" />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="results fade-in">
      <ProfileSkeleton />
      <div className="results-right">
        {[0,1,2,3].map(i => (
          <div key={i} className="stat-card">
            <Skeleton w="50%" h="11" />
            <div style={{ height: 14 }} />
            <Skeleton w="70%" h="36" />
            <div style={{ height: 8 }} />
            <Skeleton w="40%" h="11" />
          </div>
        ))}
        <div className="card span-2">
          <Skeleton w="40%" h="11" />
          <div style={{ height: 18 }} />
          <Skeleton w="100%" h="200" r="50%" style={{ maxWidth: 200, margin: '0 auto' }} />
        </div>
        <div className="card span-2">
          <Skeleton w="40%" h="11" />
          <div style={{ height: 18 }} />
          <Skeleton w="100%" h="170" />
        </div>
        <div className="card span-4">
          <Skeleton w="30%" h="11" />
          <div style={{ height: 18 }} />
          {[0,1,2,3].map(i => (
            <div key={i} style={{ marginBottom: 10 }}>
              <Skeleton w="100%" h="56" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.UI = { CountUp, StatCard, DonutChart, BarChart, Skeleton, ProfileSkeleton, ResultsSkeleton };
