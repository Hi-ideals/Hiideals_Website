import { createContext, useContext, useState, useEffect } from 'react'
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setIsAdmin(false)
    setError(null)
  }

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
