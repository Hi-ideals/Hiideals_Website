import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiShieldCheck } from 'react-icons/hi'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false })

  useEffect(() => {
    const consent = localStorage.getItem('hiideals_cookie_consent')
    if (!consent) {
      // Small delay to avoid flash
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('hiideals_cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() }))
    setShow(false)
  }

  const handleSavePrefs = () => {
    localStorage.setItem('hiideals_cookie_consent', JSON.stringify({ necessary: true, ...prefs, date: new Date().toISOString() }))
    setShow(false)
    setShowPrefs(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Main Banner */}
          {!showPrefs && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-[70] p-4"
            >
              <div
                className="max-w-4xl mx-auto rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,17,39,0.98), rgba(10,14,26,0.98))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <HiShieldCheck className="w-5 h-5 text-electric-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      We use cookies to improve your experience. By continuing to use our site, you consent to our use of cookies.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowPrefs(true)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Manage
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Modal */}
          <AnimatePresence>
            {showPrefs && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[75] flex items-center justify-center p-4"
                onClick={() => setShowPrefs(false)}
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md rounded-2xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, #0d1127, #0a0e1a)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowPrefs(false)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <HiX className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-bold text-white mb-1">Cookie Preferences</h3>
                  <p className="text-xs text-gray-500 mb-5">Manage your cookie settings below.</p>

                  <div className="space-y-4 mb-6">
                    {/* Necessary — always on */}
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="text-sm font-medium text-white">Necessary</p>
                        <p className="text-xs text-gray-500">Required for the site to function</p>
                      </div>
                      <div className="w-10 h-5.5 rounded-full bg-emerald-500/20 flex items-center px-0.5 cursor-not-allowed">
                        <div className="w-4.5 h-4.5 rounded-full bg-emerald-400 ml-auto" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="text-sm font-medium text-white">Analytics</p>
                        <p className="text-xs text-gray-500">Help us understand how you use our site</p>
                      </div>
                      <button
                        onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                        className="relative w-10 h-5.5 rounded-full transition-colors"
                        style={{ background: prefs.analytics ? 'linear-gradient(135deg, #3b82f6, #7c3aed)' : 'rgba(255,255,255,0.1)' }}
                      >
                        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${prefs.analytics ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="text-sm font-medium text-white">Marketing</p>
                        <p className="text-xs text-gray-500">Personalized content and ads</p>
                      </div>
                      <button
                        onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                        className="relative w-10 h-5.5 rounded-full transition-colors"
                        style={{ background: prefs.marketing ? 'linear-gradient(135deg, #3b82f6, #7c3aed)' : 'rgba(255,255,255,0.1)' }}
                      >
                        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${prefs.marketing ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePrefs}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                  >
                    Save Preferences
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
