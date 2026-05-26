import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormSelect, FormToggle } from '../../components/admin/FormInput'
import { HiPencil, HiTrash, HiBell } from 'react-icons/hi'

const typeOptions = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'alert', label: 'Alert' },
]

const emptyForm = { title: '', message: '', type: 'info', read: false, active: true }

export default function AdminNotifications() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setItems(await fetchCollection('notifications', 'createdAt')) }
    catch { toast.error('Failed to load') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ title: item.title || '', message: item.message || '', type: item.type || 'info', read: item.read || false, active: item.active !== false })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      await saveDoc('notifications', form, editId)
      toast.success(editId ? 'Updated' : 'Created')
      setModalOpen(false); load()
    } catch { toast.error('Failed') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('notifications', deleteId); toast.success('Deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed') }
    setDeleting(false)
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const typeColor = (t) => {
    if (t === 'success') return 'bg-green-500/10 text-green-400'
    if (t === 'warning') return 'bg-yellow-500/10 text-yellow-400'
    if (t === 'alert') return 'bg-red-500/10 text-red-400'
    return 'bg-blue-500/10 text-blue-400'
  }

  const columns = [
    { key: 'title', label: 'Notification' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'active', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{item.message}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColor(item.type)}`}>{item.type}</span>
          </div>
          <div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-xs text-electric-400">Edit</button><button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="text-xs text-red-400">Delete</button></div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3">
          <p className="text-sm text-white font-medium">{item.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{item.message}</p>
        </td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColor(item.type)}`}>{item.type}</span></td>
        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(item.createdAt)}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${item.active !== false ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{item.active !== false ? 'Active' : 'Inactive'}</span></td>
        <td className="px-4 py-3"><div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
          <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
        </div></td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Notifications" description="Manage admin notifications" actionLabel="New Notification" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['title', 'message']} renderRow={renderRow} emptyTitle="No notifications" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Notification' : 'New Notification'}>
        <div className="space-y-4">
          <FormInput label="Title" placeholder="Notification title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <FormTextarea label="Message" placeholder="Notification message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <FormSelect label="Type" options={typeOptions} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <FormToggle label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} />
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Notification?" loading={deleting} />
    </div>
  )
}
