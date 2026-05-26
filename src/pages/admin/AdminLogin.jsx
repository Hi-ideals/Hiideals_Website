import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { user, isAdmin, loading, error, loginWithGoogle, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && isAdmin) navigate('/admin', { replace: true })
  }, [user, isAdmin, navigate])

  return (
    <>
      <Helmet><title>Admin Login — Hiideals Technologies</title></Helmet>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1230 50%, #0a0e1a 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04)_0%,transparent_60%)]" />

        <motion.div
          className="relative w-full max-w-sm p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                boxShadow: '0 8px 30px rgba(59,130,246,0.25)',
              }}
            >
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Hiideals Technologies</p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              className="mb-6 p-3.5 rounded-xl text-sm text-center"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.15)',
                color: '#f87171',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
              <button
                onClick={clearError}
                className="block mx-auto mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Google sign in */}
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e5e7eb',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-500/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-center text-xs text-gray-600 mt-6">
            Only authorized administrators can access this panel.
          </p>
        </motion.div>
      </div>
    </>
  )
}
