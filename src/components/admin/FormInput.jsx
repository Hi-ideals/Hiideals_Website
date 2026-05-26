export function FormInput({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-gray-500 outline-none transition-colors ${
          error ? 'border-red-500/40 focus:border-red-400' : 'border-white/[0.08] focus:border-electric-500/50'
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

export function FormTextarea({ label, error, rows = 4, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <textarea
        rows={rows}
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none ${
          error ? 'border-red-500/40 focus:border-red-400' : 'border-white/[0.08] focus:border-electric-500/50'
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

export function FormSelect({ label, error, options = [], placeholder, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-sm text-white outline-none transition-colors ${
          error ? 'border-red-500/40 focus:border-red-400' : 'border-white/[0.08] focus:border-electric-500/50'
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

export function FormToggle({ label, checked, onChange, description }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <div>
        <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 ${
          checked ? 'bg-electric-500' : 'bg-white/10'
        }`}
        style={{ height: '22px' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : ''
          }`}
        />
      </button>
    </label>
  )
}

export function FormTagInput({ label, tags = [], onChange, placeholder = 'Type and press Enter' }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (val && !tags.includes(val)) {
        onChange([...tags, val])
        e.target.value = ''
      }
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-electric-500/10 text-electric-400 text-xs font-medium">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="hover:text-white">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-electric-500/50 transition-colors"
      />
    </div>
  )
}
