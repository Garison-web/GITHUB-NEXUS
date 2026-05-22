/* GitHub API + fallback mock data + utilities */

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dart: '#00B4AB',
  Lua: '#000080',
  R: '#198CE7',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Scala: '#c22d40',
  Clojure: '#db5855',
  'Objective-C': '#438eff',
  Zig: '#ec915c',
  Nix: '#7e7eff',
  Assembly: '#6E4C13',
  PowerShell: '#012456',
  'Jupyter Notebook': '#DA5B0B',
  Other: '#8a93c9',
};

function langColor(name) { return LANG_COLORS[name] || LANG_COLORS.Other; }

function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  if (n >= 1e3) return n.toLocaleString();
  return String(n);
}
function commaNum(n) { return (n ?? 0).toLocaleString(); }

function yearOf(iso) { return iso ? new Date(iso).getUTCFullYear() : '—'; }

const GH_TOKEN = window.__GH_TOKEN__ || '';

async function ghFetch(path) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (GH_TOKEN) headers['Authorization'] = 'Bearer ' + GH_TOKEN;
  const res = await fetch('https://api.github.com' + path, { headers });
  if (res.status === 404) throw new Error('USER_NOT_FOUND');
  if (res.status === 403) throw new Error('RATE_LIMITED');
  if (!res.ok) throw new Error('FETCH_FAILED');
  return res.json();
}

async function fetchUserBundle(login) {
  const u = login.trim().replace(/^@/, '');
  if (!u) throw new Error('EMPTY');
  // user + repos in parallel
  const [user, repos] = await Promise.all([
    ghFetch('/users/' + encodeURIComponent(u)),
    ghFetch('/users/' + encodeURIComponent(u) + '/repos?per_page=100&sort=updated'),
  ]);
  // events optional (may 404 for private)
  let events = [];
  try { events = await ghFetch('/users/' + encodeURIComponent(u) + '/events/public?per_page=100'); }
  catch (e) { events = []; }

  // aggregate stats from owned (non-fork) repos
  const owned = repos.filter(r => !r.fork);
  const totalStars = owned.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = owned.reduce((s, r) => s + (r.forks_count || 0), 0);

  // language distribution (weighted by stars + 1)
  const langTotals = {};
  for (const r of owned) {
    if (!r.language) continue;
    const w = (r.stargazers_count || 0) + 1;
    langTotals[r.language] = (langTotals[r.language] || 0) + w;
  }
  const total = Object.values(langTotals).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(langTotals)
    .map(([name, n]) => ({ name, pct: (n / total) * 100, raw: n }))
    .sort((a, b) => b.pct - a.pct);
  // collapse tail
  const top = langs.slice(0, 6);
  const tail = langs.slice(6).reduce((s, l) => s + l.pct, 0);
  if (tail > 0.5) top.push({ name: 'Other', pct: tail, raw: 0 });

  // top repos
  const topRepos = [...owned]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6)
    .map(r => ({
      name: r.name,
      full: r.full_name,
      desc: r.description,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language,
      url: r.html_url,
      updated: r.pushed_at,
    }));

  // recent activity: events per day, last 14 days
  const days = 14;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - (days - 1 - i));
    return { date: d, count: 0 };
  });
  for (const e of events) {
    const t = new Date(e.created_at);
    t.setUTCHours(0, 0, 0, 0);
    const idx = Math.round((t - buckets[0].date) / 86400000);
    if (idx >= 0 && idx < days) {
      // weight PushEvent by commits, others as 1
      const w = e.type === 'PushEvent' ? (e.payload?.commits?.length || 1) : 1;
      buckets[idx].count += w;
    }
  }

  return {
    login: user.login,
    name: user.name || user.login,
    avatar: user.avatar_url,
    bio: user.bio,
    location: user.location,
    company: user.company,
    blog: user.blog,
    joinYear: yearOf(user.created_at),
    joinedAt: user.created_at,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    totalForks,
    languages: top,
    topRepos,
    activity: buckets,
    htmlUrl: user.html_url,
  };
}

window.GH = { fetchUserBundle, langColor, formatNumber, commaNum, LANG_COLORS };
