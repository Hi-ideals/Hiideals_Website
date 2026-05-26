import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-electric-500/30 border-t-electric-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
