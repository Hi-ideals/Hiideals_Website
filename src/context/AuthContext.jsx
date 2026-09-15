import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

const googleProvider = new GoogleAuthProvider()
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000 // 2 hours inactivity timeout

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const timeoutRef = useRef(null)

  const checkAdmin = async (email) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', email))
      return adminDoc.exists() && adminDoc.data().active !== false
    } catch (err) {
      console.warn('Admin check failed:', err.message)
      return false
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const admin = await checkAdmin(firebaseUser.email)
        if (admin) {
          setUser(firebaseUser)
          setIsAdmin(true)
          setError(null)
        } else {
          // Not whitelisted — sign out
          setUser(null)
          setIsAdmin(false)
          setError('Access denied. Your email is not authorized.')
          await signOut(auth)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const admin = await checkAdmin(result.user.email)
      if (!admin) {
        setError('Access denied. Your email is not authorized.')
        await signOut(auth)
        setUser(null)
        setIsAdmin(false)
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    await signOut(auth)
    setUser(null)
    setIsAdmin(false)
    setError(null)
  }, [])

  // Auto-logout after inactivity (admin sessions only)
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (user && isAdmin) {
      timeoutRef.current = setTimeout(() => {
        logout()
      }, SESSION_TIMEOUT)
    }
  }, [user, isAdmin, logout])

  useEffect(() => {
    if (!user || !isAdmin) return
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetTimeout, { passive: true }))
    resetTimeout() // start the timer
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimeout))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [user, isAdmin, resetTimeout])

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, error, loginWithGoogle, logout, clearError: () => setError(null) }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
