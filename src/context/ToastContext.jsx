import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi'

const ToastContext = createContext()

const icons = {
  success: HiCheckCircle,
  error: HiXCircle,
  info: HiInformationCircle,
}
const colors = {
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
  error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#ef4444' },
  info: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#3b82f6' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type]
            const c = colors[t.type]
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl backdrop-blur-xl"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: c.text }} />
                <p className="text-sm text-gray-200 flex-1">{t.message}</p>
                <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-gray-500 hover:text-white shrink-0">
                  <HiX className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
