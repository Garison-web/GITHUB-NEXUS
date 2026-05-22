/* Compare-mode view: two profiles side-by-side with head-to-head bars */

function VsBadge({ winnerLabel }) {
  return (
    <div className="vs-stage">
      <div className="vs-caption">HEAD · TO · HEAD</div>
      <div className="vs-badge">
        <span className="vs-text">VS</span>
      </div>
      {winnerLabel ? <div className="vs-winner-banner">{winnerLabel}</div> : null}
    </div>
  );
}

function CompareRow({ label, icon, a, b, format = window.GH.commaNum, delay = 0 }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 120 + delay * 1000); return () => clearTimeout(t); }, [a, b, delay]);
  const max = Math.max(a || 0, b || 0, 1);
  const pa = mounted ? (a / max) * 100 : 0;
  const pb = mounted ? (b / max) * 100 : 0;
  const winner = a === b ? 'tie' : (a > b ? 'a' : 'b');
  return (
    <div className="compare-row fade-up" style={{ animationDelay: delay + 's' }}>
      <div className="label">
        <span className="icon">{icon}<b>{label}</b></span>
        <span>{winner === 'tie' ? 'TIE' : (winner === 'a' ? '◀ LEFT WINS' : 'RIGHT WINS ▶')}</span>
      </div>
      <div className="cmp-bar-row">
        <div className={'cmp-num l ' + (winner === 'b' ? 'dim' : '')}>
          <window.UI.CountUp value={a ?? 0} format={format} />
        </div>
        <div className="cmp-bar">
          <div className="fill-l" style={{ width: pa / 2 + '%' }} />
          <div className="fill-r" style={{ width: pb / 2 + '%' }} />
        </div>
        <div className={'cmp-num r ' + (winner === 'a' ? 'dim' : '')}>
          <window.UI.CountUp value={b ?? 0} format={format} />
        </div>
      </div>
    </div>
  );
}

function CompareView({ a, b }) {
  const { Icon } = window;
  const metrics = [
    { key: 'followers', label: 'Followers', icon: <Icon.users />, getter: u => u.followers },
    { key: 'publicRepos', label: 'Public Repos', icon: <Icon.repo />, getter: u => u.publicRepos },
    { key: 'totalStars', label: 'Total Stars', icon: <Icon.star />, getter: u => u.totalStars },
    { key: 'totalForks', label: 'Total Forks', icon: <Icon.fork />, getter: u => u.totalForks },
    { key: 'following', label: 'Following', icon: <Icon.user />, getter: u => u.following },
  ];

  let aWins = 0, bWins = 0;
  for (const m of metrics) {
    const va = m.getter(a), vb = m.getter(b);
    if (va > vb) aWins++;
    else if (vb > va) bWins++;
  }
  const winnerLabel = aWins === bWins
    ? `${aWins} – ${bWins} · IT'S A TIE`
    : (aWins > bWins ? `${a.login.toUpperCase()} WINS  ${aWins} – ${bWins}` : `${b.login.toUpperCase()} WINS  ${bWins} – ${aWins}`);

  return (
    <div className="compare-grid fade-in">
      <div className="compare-side">
        <ProfileCard u={a} delay={0.05} />
      </div>
      <VsBadge winnerLabel={winnerLabel} />
      <div className="compare-side">
        <ProfileCard u={b} delay={0.15} />
      </div>

      <div className="card span-3" style={{ gridColumn: '1 / -1' }}>
        <h3 className="card-title"><span className="pip" />Stat Battle</h3>
        <div className="compare-stats">
          {metrics.map((m, i) => (
            <CompareRow
              key={m.key}
              label={m.label}
              icon={m.icon}
              a={m.getter(a)}
              b={m.getter(b)}
              delay={0.05 + i * 0.05}
            />
          ))}
        </div>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="card-title"><span className="pip" />Activity Showdown · Last 14 Days</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          <CompareActivityPanel u={a} accent="var(--neon-cyan)" side="left" />
          <CompareActivityPanel u={b} accent="var(--neon-pink)" side="right" />
        </div>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="card-title"><span className="pip" />Top Repositories</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--neon-cyan)', letterSpacing: '.16em', marginBottom: 12 }}>@{a.login}</div>
            <RepoList repos={a.topRepos.slice(0, 4)} delay={0.05} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--neon-pink)', letterSpacing: '.16em', marginBottom: 12 }}>@{b.login}</div>
            <RepoList repos={b.topRepos.slice(0, 4)} delay={0.15} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareActivityPanel({ u, accent, side }) {
  const total = u.activity.reduce((s, b) => s + b.count, 0);
  return (
    <div style={{ textAlign: side === 'right' ? 'right' : 'left' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: accent, letterSpacing: '.16em', marginBottom: 6 }}>
        @{u.login}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 10, textShadow: `0 0 14px ${accent}` }}>
        <window.UI.CountUp value={total} /> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '.16em' }}>EVENTS</span>
      </div>
      <window.UI.BarChart buckets={u.activity} />
    </div>
  );
}

window.CompareView = CompareView;
