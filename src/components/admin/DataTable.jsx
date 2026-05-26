import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSearch, HiChevronLeft, HiChevronRight, HiInbox } from 'react-icons/hi'

export default function DataTable({
  columns,
  data = [],
  searchable = true,
  searchKeys = [],
  pageSize = 10,
  renderRow,
  emptyTitle = 'No data found',
  emptyDescription = 'Get started by creating your first entry.',
  loading = false,
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim() || !searchKeys.length) return data
    const q = search.toLowerCase()
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = key.split('.').reduce((o, k) => o?.[k], item)
        return String(val || '').toLowerCase().includes(q)
      })
    )
  }, [data, search, searchKeys])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize)

  // Reset page on search change
  const handleSearch = (val) => {
    setSearch(val)
    setPage(0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-electric-500/30 border-t-electric-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Search */}
      {searchable && data.length > 0 && (
        <div className="relative mb-4">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-electric-500/50 transition-colors"
          />
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <HiInbox className="w-7 h-7 text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-400">{emptyTitle}</p>
          <p className="text-xs text-gray-600 mt-1">{emptyDescription}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3"
                      style={{ width: col.width }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <AnimatePresence>
                  {paginated.map((item, idx) => (
                    <motion.tr
                      key={item.id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {renderRow(item, idx)}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            <AnimatePresence>
              {paginated.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-xl border border-white/[0.06] p-4"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  {renderRow(item, idx, true)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-xs text-gray-500">
                {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <HiChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                      i === page ? 'bg-electric-500/20 text-electric-400' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, page - 2), page + 3)}
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
