import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { GitHubEvent } from '../types/github'

interface Props { events: GitHubEvent[] }

export function ActivityChart({ events }: Props) {
  const counts: Record<string, number> = {}
  for (const event of events) {
    const day = event.created_at.slice(0, 10)
    counts[day] = (counts[day] ?? 0) + 1
  }

  const data = Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date: date.slice(5), count }))

  if (data.length === 0) return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center text-gray-400 text-sm h-full min-h-[260px]">
      No recent public activity
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Recent Activity</h3>
      <p className="text-xs text-gray-400 mb-4">Public events · last 14 days</p>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            cursor={{ fill: 'rgba(59,130,246,0.08)' }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Events" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
