interface Props {
  label: string
  valueA: number
  valueB: number
  nameA: string
  nameB: string
}

export function StatComparison({ label, valueA, valueB, nameA, nameB }: Props) {
  const total = valueA + valueB || 1
  const pctA = Math.round((valueA / total) * 100)
  const pctB = 100 - pctA
  const winner = valueA > valueB ? 'A' : valueB > valueA ? 'B' : null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
        <span className={winner === 'A' ? 'text-blue-500 font-bold' : ''}>{valueA.toLocaleString()}</span>
        <span className="text-gray-400">{label}</span>
        <span className={winner === 'B' ? 'text-purple-500 font-bold' : ''}>{valueB.toLocaleString()}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${pctA}%` }}
        />
        <div
          className="bg-purple-500 transition-all duration-700"
          style={{ width: `${pctB}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>@{nameA}</span>
        <span>@{nameB}</span>
      </div>
    </div>
  )
}
