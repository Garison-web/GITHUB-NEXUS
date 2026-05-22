interface Props {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
}

export function StatsCard({ label, value, icon, color }: Props) {
  return (
    <div className={`rounded-xl p-5 flex items-center gap-4 shadow-sm border border-white/10 bg-gradient-to-br ${color}`}>
      <div className="text-white/80 shrink-0">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className="text-white/70 text-xs uppercase tracking-wide mt-0.5">{label}</div>
      </div>
    </div>
  )
}
