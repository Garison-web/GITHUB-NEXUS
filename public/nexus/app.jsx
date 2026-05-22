/* Root app: mode toggle, search, single + compare orchestration */

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#22d3ee", "#00d4ff", "#a855f7", "#ff2e9a"],
  "glassBlur": 18,
  "starDensity": 1,
  "showStars": true,
  "showShooting": true,
  "showOrbs": true,
  "showGrid": true,
  "showDots": true,
  "vignette": true
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  ["#22d3ee", "#00d4ff", "#a855f7", "#ff2e9a"], // Cyber
  ["#ff2e9a", "#ff6b6b", "#ffb84d", "#a855f7"], // Synthwave
  ["#c6ff3a", "#22d3ee", "#00d4ff", "#ffb84d"], // Toxic
  ["#a855f7", "#ff2e9a", "#5b8cff", "#22d3ee"], // Plasma
  ["#f8fafc", "#cbd5e1", "#94a3b8", "#64748b"], // Mono Chrome
];

function ModeToggle({ mode, setMode }) {
  const { Icon } = window;
  const ref = useRef(null);
  const [thumb, setThumb] = useState({ left: 6, width: 0 });
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const btn = wrap.querySelector(`button[data-mode="${mode}"]`);
    if (!btn) return;
    setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [mode]);

  return (
    <div className="mode-toggle" data-mode={mode} ref={ref}>
      <div className="thumb" style={{ left: thumb.left, width: thumb.width }} />
      <button data-mode="search" className={mode === 'search' ? 'active' : ''} onClick={() => setMode('search')}>
        <Icon.user style={{ width: 14, height: 14 }} /> Search
      </button>
      <button data-mode="compare" className={mode === 'compare' ? 'active' : ''} onClick={() => setMode('compare')}>
        <Icon.users style={{ width: 14, height: 14 }} /> Compare
      </button>
    </div>);

}

function SearchField({ value, onChange, onSubmit, placeholder, loading, accent }) {
  const { Icon } = window;
  const inputRef = useRef(null);
  return (
    <form
      className={'search-field' + (loading ? ' loading' : '')}
      onSubmit={(e) => {e.preventDefault();onSubmit();}}
      style={accent ? { borderColor: 'var(--glass-border)', boxShadow: `0 0 0 1px ${accent}33` } : undefined}>
      
      <Icon.search className="icon" />
      <input
        ref={inputRef}
        type="text"
        spellCheck="false"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
      
      {value &&
      <button type="button" className="clear-btn" onClick={() => {onChange('');inputRef.current?.focus();}} aria-label="clear">
          <Icon.close style={{ width: 14, height: 14 }} />
        </button>
      }
      <button type="submit" className="submit-btn" disabled={!value.trim() || loading}>
        {loading ? 'SCANNING…' : 'SCAN'}
      </button>
    </form>);

}

function SingleResult({ u }) {
  const { UI, Icon } = window;
  const langMax = useMemo(() => u.languages[0]?.name || '—', [u]);
  const eventsTotal = u.activity.reduce((s, b) => s + b.count, 0);

  return (
    <div className="results fade-in">
      <ProfileCard u={u} delay={0.0} />

      <div className="results-right">
        <UI.StatCard label="Followers" value={u.followers} sub="people watching" accent="var(--neon-cyan)" icon={<Icon.users />} delay={0.05} />
        <UI.StatCard label="Public Repos" value={u.publicRepos} sub="open-source builds" accent="var(--neon-violet)" icon={<Icon.repo />} delay={0.10} />
        <UI.StatCard label="Total Stars" value={u.totalStars} sub="across own repos" accent="var(--neon-amber)" icon={<Icon.star />} delay={0.15} />
        <UI.StatCard label="Total Forks" value={u.totalForks} sub="copies in the wild" accent="var(--neon-pink)" icon={<Icon.fork />} delay={0.20} />

        <div className="card span-2 fade-up" style={{ animationDelay: '.25s' }}>
          <h3 className="card-title"><span className="pip" />Language Distribution</h3>
          <UI.DonutChart data={u.languages} />
          <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '.1em' }}>
            DOMINANT · <span style={{ color: window.GH.langColor(langMax) }}>●</span> <span style={{ color: 'var(--ink)' }}>{langMax}</span>
          </div>
        </div>

        <div className="card span-2 fade-up" style={{ animationDelay: '.30s' }}>
          <h3 className="card-title"><span className="pip" />Recent Activity · Last 14 Days</h3>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, lineHeight: 1, marginBottom: 4, textShadow: '0 0 16px rgba(0,212,255,.55)' }}>
            <UI.CountUp value={eventsTotal} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '.18em', marginLeft: 10 }}>EVENTS</span>
          </div>
          <UI.BarChart buckets={u.activity} />
        </div>

        <div className="card span-4 fade-up" style={{ animationDelay: '.40s' }}>
          <h3 className="card-title">
            <span className="pip" />Top Repositories · By Stars
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '.12em' }}>
              CLICK TO OPEN ↗
            </span>
          </h3>
          <RepoList repos={u.topRepos} />
        </div>
      </div>
    </div>);

}

function Empty({ mode, onPick }) {
  const suggestions = mode === 'compare' ?
  [['torvalds', 'gaearon'], ['sindresorhus', 'tj'], ['gvanrossum', 'matz'], ['octocat', 'defunkt']] :
  ['torvalds', 'gaearon', 'sindresorhus', 'octocat', 'tj', 'addyosmani'];

  return (
    <div className="empty fade-in">
      <div className="empty-art">
        <div className="ring" />
        <div className="ring r2" />
        <div className="ring r3" />
        <div className="core" />
      </div>
      <h2>{mode === 'compare' ? 'PICK TWO CONTENDERS' : 'SCAN ANY GITHUB USER'}</h2>
      <p>
        {mode === 'compare' ?
        'Enter two GitHub handles to summon a head-to-head: followers, repos, stars, forks, activity. Winner takes all.' :
        'Type a GitHub username above. We\'ll pull their profile, language mix, activity pulse, and top repositories — live from the GitHub API.'}
      </p>
      <div className="suggested">
        {suggestions.map((s, i) => {
          const label = Array.isArray(s) ? s.join('  vs  ') : s;
          return <button key={i} onClick={() => onPick(s)}>{label}</button>;
        })}
      </div>
    </div>);

}

function ErrorBanner({ message }) {
  const { Icon } = window;
  return (
    <div className="error-banner fade-in">
      <Icon.alert /> <span>{message}</span>
    </div>);

}

function errMsg(e) {
  if (!e) return 'Something went wrong.';
  const code = e.message || String(e);
  if (code === 'USER_NOT_FOUND') return "No GitHub user with that handle. Check the spelling and try again.";
  if (code === 'RATE_LIMITED') return "GitHub's rate limit kicked in. Wait a minute and retry — or sign in to lift the cap.";
  if (code === 'EMPTY') return "Enter a username first.";
  return "Couldn't reach GitHub. Check your connection and try again.";
}

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // apply palette + glass blur to :root CSS variables
  useEffect(() => {
    const r = document.documentElement.style;
    const [c0, c1, c2, c3] = t.palette;
    r.setProperty('--neon-cyan', c0);
    r.setProperty('--neon-blue', c1);
    r.setProperty('--neon-violet', c2);
    r.setProperty('--neon-pink', c3);
    r.setProperty('--glass-blur', t.glassBlur + 'px');
  }, [t.palette, t.glassBlur]);

  const [mode, setMode] = useState(() => {
    const m = new URLSearchParams(location.hash.slice(1)).get('mode');
    return m === 'compare' ? 'compare' : 'search';
  });

  // single mode
  const [q1, setQ1] = useState('');
  const [user1, setUser1] = useState(null);
  const [loading1, setLoading1] = useState(false);

  // compare mode
  const [qA, setQA] = useState('');
  const [qB, setQB] = useState('');
  const [userA, setUserA] = useState(null);
  const [userB, setUserB] = useState(null);
  const [loadingC, setLoadingC] = useState(false);

  const [error, setError] = useState(null);

  // persist last query in hash
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (mode === 'search' && user1) params.set('u', user1.login);
    if (mode === 'compare' && userA && userB) {params.set('a', userA.login);params.set('b', userB.login);}
    history.replaceState(null, '', '#' + params.toString());
  }, [mode, user1, userA, userB]);

  // initial: read hash, optionally auto-load
  useEffect(() => {
    const params = new URLSearchParams(location.hash.slice(1));
    const u = params.get('u');
    const a = params.get('a');
    const b = params.get('b');
    if (mode === 'search' && u) {setQ1(u);doSearch(u);} else
    if (mode === 'compare' && a && b) {setQA(a);setQB(b);doCompare(a, b);}
    // eslint-disable-next-line
  }, []);

  async function doSearch(name) {
    const q = (name ?? q1).trim();
    if (!q) return;
    setError(null);
    setLoading1(true);
    setUser1(null);
    try {
      const u = await window.GH.fetchUserBundle(q);
      setUser1(u);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading1(false);
    }
  }

  async function doCompare(aName, bName) {
    const a = (aName ?? qA).trim();
    const b = (bName ?? qB).trim();
    if (!a || !b) {setError("Enter two usernames to compare.");return;}
    if (a.toLowerCase() === b.toLowerCase()) {setError("Pick two different users to compare.");return;}
    setError(null);
    setLoadingC(true);
    setUserA(null);setUserB(null);
    try {
      const [ua, ub] = await Promise.all([
      window.GH.fetchUserBundle(a),
      window.GH.fetchUserBundle(b)]
      );
      setUserA(ua);setUserB(ub);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoadingC(false);
    }
  }

  function pickSuggestion(s) {
    if (Array.isArray(s)) {
      setQA(s[0]);setQB(s[1]);
      doCompare(s[0], s[1]);
    } else {
      setQ1(s);
      doSearch(s);
    }
  }

  // switch mode: clear errors
  function switchMode(m) {
    setMode(m);
    setError(null);
  }

  return (
    <>
      <window.Background
        stars={t.showStars}
        starDensity={t.starDensity}
        shootingStars={t.showShooting}
        orbs={t.showOrbs}
        grid={t.showGrid}
        dots={t.showDots}
        vignette={t.vignette}
      />
      <div className="app">
        <header className="topbar fade-in">
          <div className="brand">
            <div className="brand-mark"><window.Icon.github /></div>
            <div>
              <div className="brand-name">GITHUB · <b>NEXUS</b></div>
              <div className="brand-sub">STATS DASHBOARD</div>
            </div>
          </div>
          <div className="status-pill">
            <span className="dot" /> LIVE · GITHUB API
          </div>
        </header>

        <div className="control-row fade-in" style={{ animationDelay: '.05s' }}>
          <ModeToggle mode={mode} setMode={switchMode} />

          {mode === 'search' ?
          <div className="search-wrap">
              <SearchField
              value={q1} onChange={setQ1}
              onSubmit={() => doSearch()}
              loading={loading1}
              placeholder="Enter a GitHub username — e.g. torvalds" />
            
            </div> :

          <div className="search-wrap dual">
              <SearchField
              value={qA} onChange={setQA}
              onSubmit={() => doCompare()}
              loading={loadingC}
              placeholder="Contender A — e.g. torvalds"
              accent="var(--neon-cyan)" />
            
              <div className="vs-mini">VS</div>
              <SearchField
              value={qB} onChange={setQB}
              onSubmit={() => doCompare()}
              loading={loadingC}
              placeholder="Contender B — e.g. gaearon"
              accent="var(--neon-pink)" />
            
            </div>
          }
        </div>

        {error && <ErrorBanner message={error} />}

        {/* SEARCH MODE */}
        {mode === 'search' && (
        loading1 ? <window.UI.ResultsSkeleton /> :
        user1 ? <SingleResult key={user1.login} u={user1} /> :
        <Empty mode="search" onPick={pickSuggestion} />)
        }

        {/* COMPARE MODE */}
        {mode === 'compare' && (
        loadingC ? <window.UI.ResultsSkeleton /> :
        userA && userB ? <window.CompareView key={userA.login + '_' + userB.login} a={userA} b={userB} /> :
        <Empty mode="compare" onPick={pickSuggestion} />)
        }

        <div className="foot">
          DATA · GITHUB REST API v3 &nbsp;·&nbsp; ANONYMOUS RATE LIMIT APPLIES &nbsp;·&nbsp; v1.0
        </div>
      </div>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Theme" />
        <window.TweakColor
          label="Palette"
          value={t.palette}
          options={PALETTE_OPTIONS}
          onChange={(v) => setTweak('palette', v)}
        />
        <window.TweakSlider
          label="Glass blur"
          value={t.glassBlur}
          min={0} max={32} step={1} unit="px"
          onChange={(v) => setTweak('glassBlur', v)}
        />

        <window.TweakSection label="Background" />
        <window.TweakToggle label="Drift orbs"     value={t.showOrbs}     onChange={(v) => setTweak('showOrbs', v)} />
        <window.TweakToggle label="Starfield"      value={t.showStars}    onChange={(v) => setTweak('showStars', v)} />
        <window.TweakToggle label="Shooting stars" value={t.showShooting} onChange={(v) => setTweak('showShooting', v)} />
        <window.TweakToggle label="Grid lines"     value={t.showGrid}     onChange={(v) => setTweak('showGrid', v)} />
        <window.TweakToggle label="Dot pattern"    value={t.showDots}     onChange={(v) => setTweak('showDots', v)} />
        <window.TweakToggle label="Vignette"       value={t.vignette}     onChange={(v) => setTweak('vignette', v)} />
        <window.TweakSlider
          label="Star density"
          value={t.starDensity}
          min={0} max={2.5} step={0.1}
          onChange={(v) => setTweak('starDensity', v)}
        />
      </window.TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);