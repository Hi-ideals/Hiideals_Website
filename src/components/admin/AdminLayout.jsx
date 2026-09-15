import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  HiHome, HiCube, HiBriefcase, HiUserGroup, HiStar,
  HiDocumentText, HiAcademicCap, HiBell,
  HiSpeakerphone, HiMail, HiCog, HiLogout, HiMenuAlt2, HiX,
  HiShieldCheck,
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

const navSections = [
  { label: 'Main', items: [
    { name: 'Dashboard', path: '/admin', icon: HiHome, end: true },
    { name: 'Site Settings', path: '/admin/settings', icon: HiCog },
  ]},
  { label: 'Content', items: [
    { name: 'Services', path: '/admin/services', icon: HiBriefcase },
    { name: 'Products', path: '/admin/products', icon: HiCube },
    { name: 'Blog Posts', path: '/admin/blog', icon: HiDocumentText },
    { name: 'Team', path: '/admin/team', icon: HiUserGroup },
    { name: 'Testimonials', path: '/admin/testimonials', icon: HiStar },
  ]},
  { label: 'Recruitment', items: [
    { name: 'Careers', path: '/admin/careers', icon: HiBriefcase },
    { name: 'Internships', path: '/admin/internships', icon: HiAcademicCap },
  ]},
  { label: 'Engagement', items: [
    { name: 'Messages', path: '/admin/messages', icon: HiMail },
    { name: 'Newsletter', path: '/admin/newsletter', icon: HiMail },
    { name: 'Notifications', path: '/admin/notifications', icon: HiBell },
    { name: 'Campaigns', path: '/admin/campaigns', icon: HiSpeakerphone },
  ]},
  { label: 'System', items: [
    { name: 'Admins', path: '/admin/admins', icon: HiShieldCheck },
  ]},
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-electric-500/10 text-electric-400'
        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
    }`

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.04]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)' }}
        >
          <span className="text-white font-bold text-sm">H</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Hiideals</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 px-3 mb-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.photoURL || ''}
            alt=""
            className="w-8 h-8 rounded-lg object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.displayName || 'Admin'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200"
        >
          <HiLogout className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0e1a' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30"
        style={{
          background: 'linear-gradient(180deg, #0d1127, #0a0e1a)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative w-72 h-full"
            style={{
              background: 'linear-gradient(180deg, #0d1127, #0a0e1a)',
              borderRight: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 sm:px-6"
          style={{
            background: 'rgba(10,14,26,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {sidebarOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/admin/notifications"
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <HiBell className="w-5 h-5" />
            </NavLink>
            <NavLink to="/" target="_blank" className="text-xs text-gray-500 hover:text-electric-400 transition-colors">
              View Site &rarr;
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
