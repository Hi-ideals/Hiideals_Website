import { useLocation } from 'react-router-dom'
import { HiCog } from 'react-icons/hi'

export default function AdminPlaceholder() {
  const location = useLocation()
  const pageName = location.pathname
    .replace('/admin/', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase()) || 'Section'

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.1)' }}
      >
        <HiCog className="w-7 h-7 text-electric-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{pageName}</h2>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        This section will be built in Phase 3. Full CRUD management coming soon.
      </p>
    </div>
  )
}
