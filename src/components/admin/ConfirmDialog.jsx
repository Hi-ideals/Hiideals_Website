import { motion, AnimatePresence } from 'framer-motion'
import { HiExclamation } from 'react-icons/hi'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) {
  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm rounded-2xl border border-white/[0.06] p-6 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #111632, #0d1127)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <HiExclamation className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{title || 'Are you sure?'}</h3>
                <p className="text-sm text-gray-400 mt-1">{message || 'This action cannot be undone.'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
