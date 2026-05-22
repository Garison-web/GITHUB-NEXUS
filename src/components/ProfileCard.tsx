import { MapPin, Link2, Calendar } from 'lucide-react'
import type { GitHubUser } from '../types/github'

interface Props {
  user: GitHubUser
}

export function ProfileCard({ user }: Props) {
  const joined = new Date(user.created_at).getFullYear()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-5 items-start">
      <div className="relative shrink-0">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-20 h-20 rounded-full ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800"
        />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {user.name ?? user.login}
            </h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              @{user.login}
            </a>
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity"
          >
            View on GitHub
          </a>
        </div>

        {user.bio && (
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{user.bio}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400">
          {user.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-gray-400" />{user.location}
            </span>
          )}
          {user.blog && (
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
              <Link2 size={13} className="text-gray-400" />
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-gray-400" />Joined {joined}
          </span>
        </div>
      </div>
    </div>
  )
}
