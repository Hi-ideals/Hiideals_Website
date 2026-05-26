import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { collection, getDocs, query, orderBy, limit, where, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { seedFirestore } from '../../firebase/seedData'
import { useAuth } from '../../context/AuthContext'
import {
  HiCube, HiDocumentText, HiUserGroup, HiMail,
  HiBriefcase, HiClock, HiEye, HiDatabase,
} from 'react-icons/hi'

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div
      className="p-5 rounded-2xl transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}12`, border: `1px solid ${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            {loading ? <span className="inline-block w-8 h-6 bg-white/5 rounded animate-pulse" /> : value}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2.5 cursor-pointer group">
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
          checked ? 'bg-electric-500' : 'bg-white/10'
        }`}
        style={{ width: 40, height: 22 }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </button>
    </label>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [messages, setMessages] = useState([])
  const [applications, setApplications] = useState([])
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState(null)
  const [toggles, setToggles] = useState({
    showServices: true,
    showProducts: true,
    showTestimonials: true,
    showBlog: true,
    showCareers: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const counts = {}
        const collections = ['products', 'services', 'blog_posts', 'team', 'careers', 'testimonials']
        await Promise.all(
          collections.map(async (name) => {
            try {
              const snap = await getDocs(collection(db, name))
              counts[name] = snap.size
            } catch { counts[name] = 0 }
          })
        )

        // Unread messages count
        try {
          const msgQ = query(collection(db, 'messages'), where('read', '==', false))
          const msgSnap = await getDocs(msgQ)
          counts.unreadMessages = msgSnap.size
        } catch { counts.unreadMessages = 0 }

        // Pending applications count
        try {
          const appQ = query(collection(db, 'job_applications'), where('status', '==', 'pending'))
          const appSnap = await getDocs(appQ)
          counts.pendingApplications = appSnap.size
        } catch { counts.pendingApplications = 0 }

        setStats(counts)

        // Recent messages
        try {
          const msgQ2 = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5))
          const msgSnap2 = await getDocs(msgQ2)
          setMessages(msgSnap2.docs.map(d => ({ id: d.id, ...d.data() })))
        } catch { /* empty */ }

        // Recent job applications
        try {
          const appQ2 = query(collection(db, 'job_applications'), orderBy('createdAt', 'desc'), limit(5))
          const appSnap2 = await getDocs(appQ2)
          setApplications(appSnap2.docs.map(d => ({ id: d.id, ...d.data() })))
        } catch { /* empty */ }

        // Load toggles from site_settings
        try {
          const { getDoc } = await import('firebase/firestore')
          const { doc: docRef } = await import('firebase/firestore')
          const settingsSnap = await getDoc(doc(db, 'site_settings', 'homepage'))
          if (settingsSnap.exists()) {
            const data = settingsSnap.data()
            setToggles(prev => ({ ...prev, ...data }))
          }
        } catch { /* use defaults */ }

      } catch (err) {
        console.warn('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggle = async (key, value) => {
    setToggles(prev => ({ ...prev, [key]: value }))
    try {
      await updateDoc(doc(db, 'site_settings', 'homepage'), { [key]: value })
    } catch (err) {
      console.warn('Toggle update failed:', err)
    }
  }

  const statCards = [
    { icon: HiCube, label: 'Products', value: stats.products ?? 0, color: '#3b82f6' },
    { icon: HiDocumentText, label: 'Blog Posts', value: stats.blog_posts ?? 0, color: '#8b5cf6' },
    { icon: HiUserGroup, label: 'Team Members', value: stats.team ?? 0, color: '#06b6d4' },
    { icon: HiMail, label: 'Unread Messages', value: stats.unreadMessages ?? 0, color: '#f59e0b' },
    { icon: HiBriefcase, label: 'Pending Applications', value: stats.pendingApplications ?? 0, color: '#10b981' },
  ]

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <Helmet><title>Dashboard — Hiideals Admin</title></Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your website content and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div
          className="lg:col-span-1 rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
            <HiMail className="w-4 h-4 text-gray-500" />
          </div>
          {messages.length === 0 ? (
            <p className="text-xs text-gray-600 py-4 text-center">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                  style={{ border: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white truncate">{msg.name || 'Anonymous'}</p>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-electric-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.subject || msg.message}</p>
                  <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                    <HiClock className="w-3 h-3" /> {formatDate(msg.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div
          className="lg:col-span-1 rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Applications</h2>
            <HiBriefcase className="w-4 h-4 text-gray-500" />
          </div>
          {applications.length === 0 ? (
            <p className="text-xs text-gray-600 py-4 text-center">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                  style={{ border: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <p className="text-sm font-medium text-white truncate">{app.name}</p>
                  <p className="text-xs text-gray-500 truncate">{app.position || 'General'}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: app.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                        color: app.status === 'pending' ? '#f59e0b' : '#10b981',
                      }}
                    >
                      {app.status || 'pending'}
                    </span>
                    <p className="text-[10px] text-gray-600 flex items-center gap-1">
                      <HiClock className="w-3 h-3" /> {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Toggles */}
        <div
          className="lg:col-span-1 rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Homepage Sections</h2>
            <HiEye className="w-4 h-4 text-gray-500" />
          </div>
          <div className="divide-y divide-white/[0.03]">
            <ToggleSwitch label="Services Section" checked={toggles.showServices} onChange={(v) => handleToggle('showServices', v)} />
            <ToggleSwitch label="Products Section" checked={toggles.showProducts} onChange={(v) => handleToggle('showProducts', v)} />
            <ToggleSwitch label="Testimonials" checked={toggles.showTestimonials} onChange={(v) => handleToggle('showTestimonials', v)} />
            <ToggleSwitch label="Blog Section" checked={toggles.showBlog} onChange={(v) => handleToggle('showBlog', v)} />
            <ToggleSwitch label="Careers Section" checked={toggles.showCareers} onChange={(v) => handleToggle('showCareers', v)} />
          </div>
        </div>
      </div>

      {/* Seed Data */}
      <div
        className="mt-8 rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <HiDatabase className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-white">Seed Database</p>
              <p className="text-xs text-gray-500">Populate Firestore with sample data for all collections. Safe to run multiple times.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {seedResult && (
              <span className="text-xs text-emerald-400">{seedResult.seeded} created, {seedResult.skipped} skipped</span>
            )}
            <button
              onClick={async () => {
                setSeeding(true)
                setSeedResult(null)
                const result = await seedFirestore(user?.email)
                setSeedResult(result)
                setSeeding(false)
                // Refresh stats
                window.location.reload()
              }}
              disabled={seeding}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                boxShadow: '0 4px 15px rgba(59,130,246,0.2)',
              }}
            >
              {seeding ? 'Seeding...' : 'Seed Data'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
