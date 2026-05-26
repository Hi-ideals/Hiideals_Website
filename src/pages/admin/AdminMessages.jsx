import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc, exportToExcel } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { HiMail, HiMailOpen, HiTrash, HiEye, HiDownload, HiExternalLink } from 'react-icons/hi'

export default function AdminMessages() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMsg, setViewMsg] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState('all') // all | unread | read

  const load = async () => {
    setLoading(true)
    try { setItems(await fetchCollection('messages', 'createdAt')) }
    catch { toast.error('Failed to load messages') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markAsRead = async (msg) => {
    if (!msg.read) {
      await saveDoc('messages', { read: true }, msg.id)
      load()
    }
    setViewMsg(msg)
  }

  const toggleRead = async (id, currentRead) => {
    try {
      await saveDoc('messages', { read: !currentRead }, id)
      toast.success(currentRead ? 'Marked unread' : 'Marked read')
      load()
    } catch { toast.error('Failed') }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('messages', deleteId); toast.success('Message deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed') }
    setDeleting(false)
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const filtered = filter === 'all' ? items : items.filter((m) => filter === 'unread' ? !m.read : m.read)
  const unreadCount = items.filter((m) => !m.read).length

  const columns = [
    { key: 'sender', label: 'From' },
    { key: 'subject', label: 'Subject' },
    { key: 'date', label: 'Date' },
    { key: 'actions', label: '', width: '140px' },
  ]

  const renderRow = (item, _, isMobile) => {
    const isUnread = !item.read
    if (isMobile) {
      return (
        <div className="space-y-2" onClick={() => markAsRead(item)}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isUnread && <span className="w-2 h-2 rounded-full bg-electric-500 shrink-0" />}
                <p className={`text-sm ${isUnread ? 'font-semibold text-white' : 'text-gray-300'}`}>{item.name}</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{item.subject}</p>
            </div>
            <span className="text-[10px] text-gray-500 shrink-0">{formatDate(item.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{item.message}</p>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isUnread && <span className="w-2 h-2 rounded-full bg-electric-500 shrink-0" />}
            <div>
              <p className={`text-sm ${isUnread ? 'font-semibold text-white' : 'text-gray-300'}`}>{item.name}</p>
              <p className="text-xs text-gray-500">{item.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <p className={`text-sm ${isUnread ? 'text-white' : 'text-gray-400'}`}>{item.subject}</p>
          <p className="text-xs text-gray-600 line-clamp-1">{item.message}</p>
        </td>
        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(item.createdAt)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={() => markAsRead(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiEye className="w-4 h-4" /></button>
            <button onClick={() => toggleRead(item.id, item.read)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors">
              {item.read ? <HiMail className="w-4 h-4" /> : <HiMailOpen className="w-4 h-4" />}
            </button>
            <a href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || '')}`} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiExternalLink className="w-4 h-4" /></a>
            <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
          </div>
        </td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Messages" description={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}>
        {items.length > 0 && (
          <button onClick={() => exportToExcel(items, 'messages')} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 border border-white/[0.08] hover:bg-white/[0.04] transition-colors"><HiDownload className="w-4 h-4" /> Export</button>
        )}
      </PageHeader>

      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-white/[0.03] w-fit">
        {[['all', 'All'], ['unread', `Unread (${unreadCount})`], ['read', 'Read']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === key ? 'bg-electric-500/10 text-electric-400' : 'text-gray-500 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchable searchKeys={['name', 'email', 'subject', 'message']} renderRow={renderRow} emptyTitle="No messages" emptyDescription="Messages from the contact form will appear here." />

      <Modal open={!!viewMsg} onClose={() => setViewMsg(null)} title={viewMsg?.subject || 'Message'}>
        {viewMsg && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">From</p><p className="text-sm text-white">{viewMsg.name}</p></div>
              <div><p className="text-xs text-gray-500">Email</p><p className="text-sm text-white">{viewMsg.email}</p></div>
              <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm text-white">{viewMsg.phone || '—'}</p></div>
              <div><p className="text-xs text-gray-500">Date</p><p className="text-sm text-white">{formatDate(viewMsg.createdAt)}</p></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Message</p>
              <p className="text-sm text-gray-200 bg-white/[0.02] rounded-xl p-4 whitespace-pre-wrap">{viewMsg.message}</p>
            </div>
            <div className="flex justify-end pt-2 border-t border-white/[0.06]">
              <a href={`mailto:${viewMsg.email}?subject=Re: ${encodeURIComponent(viewMsg.subject || '')}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                <HiExternalLink className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Message?" loading={deleting} />
    </div>
  )
}
