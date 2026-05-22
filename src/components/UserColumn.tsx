import { MapPin, Link2, Calendar, Star, GitFork, BookOpen, Users } from 'lucide-react'
import type { GitHubUser, GitHubRepo, GitHubEvent } from '../types/github'
import { LanguageChart } from './LanguageChart'
import { ActivityChart } from './ActivityChart'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', CSS: '#563d7c',
  HTML: '#e34c26', 'C++': '#f34b7d', C: '#555555', Ruby: '#701516',
  Swift: '#ffac45', Kotlin: '#A97BFF', Shell: '#89e051',
}

interface Props {
  user: GitHubUser
  repos: GitHubRepo[]
  events: GitHubEvent[]
  accent: string
}

export function UserColumn({ user, repos, events, accent }: Props) {
  const joined = new Date(user.created_at).getFullYear()
  const topRepos = [...repos].filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <img src={user.avatar_url} alt={user.login}
            className={`w-14 h-14 rounded-full ring-2 ring-offset-2 dark:ring-offset-gray-800 ${accent}`} />
          <div className="min-w-0">
            <div className="font-bold text-gray-900 dark:text-white truncate">{user.name ?? user.login}</div>
            <a href={user.html_url} target="_blank" rel="noreferrer"
              className="text-blue-500 text-xs hover:underline">@{user.login}</a>
          </div>
        </div>
        {user.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{user.bio}</p>}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <Users size={11} />, val: user.followers.toLocaleString(), label: 'Followers' },
            { icon: <BookOpen size={11} />, val: user.public_repos, label: 'Repos' },
            { icon: <Star size={11} />, val: totalStars.toLocaleString(), label: 'Stars' },
            { icon: <Calendar size={11} />, val: `Since ${joined}`, label: '' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <span className="text-gray-400">{s.icon}</span>
              <span className="font-semibold">{s.val}</span>
              {s.label && <span className="text-gray-400">{s.label}</span>}
            </div>
          ))}
        </div>
        {(user.location || user.blog) && (
          <div className="mt-3 flex flex-col gap-1">
            {user.location && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{user.location}</span>}
            {user.blog && <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs text-blue-400 hover:underline truncate">
              <Link2 size={11} />{user.blog.replace(/^https?:\/\//, '')}
            </a>}
          </div>
        )}
      </div>

      {/* Charts */}
      <LanguageChart repos={repos} />
      <ActivityChart events={events} />

      {/* Top repos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Repos</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {topRepos.map(repo => (
            <div key={repo.id} className="px-5 py-3">
              <a href={repo.html_url} target="_blank" rel="noreferrer"
                className="text-xs font-semibold text-blue-500 hover:underline truncate block">{repo.name}</a>
              {repo.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{repo.description}</p>}
              <div className="flex items-center gap-3 mt-1.5">
                {repo.language && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#8b949e' }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-400"><Star size={10} />{repo.stargazers_count}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><GitFork size={10} />{repo.forks_count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
