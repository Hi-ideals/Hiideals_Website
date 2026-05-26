export function SkeletonLine({ className = '' }) {
  return <div className={`h-4 rounded-lg bg-white/[0.04] animate-pulse ${className}`} />
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`rounded-2xl bg-white/[0.04] animate-pulse ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <SkeletonBlock className="h-40 mb-4" />
      <SkeletonLine className="w-2/3 mb-3" />
      <SkeletonLine className="w-full mb-2" />
      <SkeletonLine className="w-4/5" />
    </div>
  )
}

export function SkeletonGrid({ count = 3, cols = 3 }) {
  const colsClass = cols === 4 ? 'lg:grid-cols-4' : cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-5`}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
