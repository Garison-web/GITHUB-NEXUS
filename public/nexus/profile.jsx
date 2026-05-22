/* Profile card + Repo list */

function ProfileCard({ u, delay = 0 }) {
  const { Icon } = window;
  return (
    <div className="card profile-card fade-up" style={{ animationDelay: delay + 's' }}>
      <div className="avatar-ring">
        <div className="avatar-inner">
          <img src={u.avatar} alt={u.login} loading="lazy" />
        </div>
      </div>
      <div>
        <h2 className="profile-name">{u.name}</h2>
        <div className="profile-handle">@{u.login}</div>
      </div>
      {u.bio && <p className="profile-bio">{u.bio}</p>}
      <div className="profile-meta">
        {u.company && (
          <div className="row"><Icon.building /><span><b>{u.company}</b></span></div>
        )}
        {u.location && (
          <div className="row"><Icon.location /><span>{u.location}</span></div>
        )}
        {u.blog && (
          <div className="row"><Icon.link />
            <a href={(u.blog.startsWith('http') ? '' : 'https://') + u.blog} target="_blank" rel="noreferrer"
               style={{ color: 'var(--neon-cyan)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {u.blog}
            </a>
          </div>
        )}
        <div className="row"><Icon.calendar /><span>Joined <b>{u.joinYear}</b></span></div>
        <div className="row"><Icon.users /><span><b>{window.GH.commaNum(u.followers)}</b> followers · <b>{window.GH.commaNum(u.following)}</b> following</span></div>
      </div>
    </div>
  );
}

function RepoList({ repos, delay = 0 }) {
  const { Icon } = window;
  if (!repos || repos.length === 0) {
    return <div style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No public repositories</div>;
  }
  return (
    <div className="repos stagger" style={{ animationDelay: delay + 's' }}>
      {repos.map((r) => {
        const color = window.GH.langColor(r.language || 'Other');
        return (
          <a key={r.full} className="repo" href={r.url} target="_blank" rel="noreferrer"
             style={{ '--lang': color, textDecoration: 'none', color: 'inherit' }}>
            <div className="repo-name">
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
              <Icon.arrowRight className="arrow" style={{ width: 14, height: 14 }} />
            </div>
            <div className="repo-meta">
              {r.language && (
                <span className="m"><span className="lang-dot" /> {r.language}</span>
              )}
              <span className="m"><Icon.star style={{ color }} /> {window.GH.formatNumber(r.stars)}</span>
              <span className="m"><Icon.fork /> {window.GH.formatNumber(r.forks)}</span>
            </div>
            {r.desc && <div className="repo-desc">{r.desc}</div>}
          </a>
        );
      })}
    </div>
  );
}

window.ProfileCard = ProfileCard;
window.RepoList = RepoList;
