function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />
}

export function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex gap-5 items-start">
        <Bone className="w-20 h-20 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <Bone className="h-5 w-40" />
          <Bone className="h-4 w-24" />
          <Bone className="h-3 w-full mt-2" />
          <Bone className="h-3 w-3/4" />
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Bone key={i} className="h-20 rounded-xl" />)}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Bone className="h-64 rounded-xl" />
        <Bone className="h-64 rounded-xl" />
      </div>
      {/* Repos */}
      <Bone className="h-80 rounded-xl" />
    </div>
  )
}
