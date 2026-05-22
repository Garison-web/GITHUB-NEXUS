import { useState, type FormEvent } from 'react'
import { Search, GitBranch } from 'lucide-react'

interface Props {
  label: string
  onSearch: (username: string) => void
  loading: boolean
  color: string
}

function UserSearchBar({ label, onSearch, loading, color }: Props) {
  const [value, setValue] = useState('')
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 flex-1">
      <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <GitBranch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="GitHub username..."
            disabled={loading}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Search size={14} />{loading ? '...' : 'Go'}
        </button>
      </div>
    </form>
  )
}

interface CompareSearchProps {
  onSearchLeft: (u: string) => void
  onSearchRight: (u: string) => void
  loadingLeft: boolean
  loadingRight: boolean
}

export function CompareSearch({ onSearchLeft, onSearchRight, loadingLeft, loadingRight }: CompareSearchProps) {
  return (
    <div className="flex items-end gap-4 w-full max-w-3xl mx-auto">
      <UserSearchBar label="User A" onSearch={onSearchLeft} loading={loadingLeft} color="text-blue-400" />
      <div className="shrink-0 mb-1 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">vs</div>
      <UserSearchBar label="User B" onSearch={onSearchRight} loading={loadingRight} color="text-purple-400" />
    </div>
  )
}
