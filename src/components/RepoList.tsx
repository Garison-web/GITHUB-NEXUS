import { Star, GitFork, ExternalLink } from 'lucide-react'
import type { GitHubRepo } from '../types/github'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', CSS: '#563d7c',
  HTML: '#e34c26', 'C++': '#f34b7d', C: '#555555', Ruby: '#701516',
  Swift: '#ffac45', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
}

function LangDot({ lang }: { lang: string }) {
  const color = LANG_COLORS[lang] ?? '#8b949e'
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {lang}
    </span>
  )
}

interface Props { repos: GitHubRepo[] }

export function RepoList({ repos }: Props) {
  const sorted = [...repos]
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Repositories</h3>
        <p className="text-xs text-gray-400 mt-0.5">Sorted by stars · excluding forks</p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {sorted.map(repo => (
          <div key={repo.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm"
                >
                  {repo.name}
                  <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                {repo.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{repo.description}</p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  {repo.language && <LangDot lang={repo.language} />}
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Star size={12} />{repo.stargazers_count.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <GitFork size={12} />{repo.forks_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
