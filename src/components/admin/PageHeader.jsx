import { HiPlus } from 'react-icons/hi'

export default function PageHeader({ title, description, actionLabel, onAction, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionLabel && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-electric-500/20"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            <HiPlus className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
