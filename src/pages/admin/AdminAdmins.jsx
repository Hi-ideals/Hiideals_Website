import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormSelect, FormToggle } from '../../components/admin/FormInput'
import { HiPencil, HiTrash, HiShieldCheck } from 'react-icons/hi'

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
]

const emptyForm = { name: '', role: 'admin', active: true }

export default function AdminAdmins() {
  const toast = useToast()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [email, setEmail] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setItems(await fetchCollection('admins', 'createdAt')) }
    catch { toast.error('Failed to load admins') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setEmail(''); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setEmail(item.id) // email is the doc ID
    setForm({ name: item.name || '', role: item.role || 'admin', active: item.active !== false })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!editId && !email.trim()) return toast.error('Email is required')
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      const docId = editId || email.trim().toLowerCase()
      await saveDoc('admins', form, docId)
      toast.success(editId ? 'Admin updated' : 'Admin added')
      setModalOpen(false); load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (deleteId === user?.email) {
      toast.error("You can't remove yourself!")
      setConfirmOpen(false)
      return
    }
    setDeleting(true)
    try { await removeDoc('admins', deleteId); toast.success('Admin removed'); setConfirmOpen(false); load() }
    catch { toast.error('Failed to remove') }
    setDeleting(false)
  }

  const roleColor = (r) => {
    if (r === 'super_admin') return 'bg-purple-500/10 text-purple-400'
    if (r === 'admin') return 'bg-blue-500/10 text-blue-400'
    return 'bg-gray-500/10 text-gray-400'
  }

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'active', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    const isSelf = item.id === user?.email
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{item.name || item.id}</p>
                {isSelf && <span className="text-[10px] px-1.5 py-0.5 rounded bg-electric-500/10 text-electric-400">You</span>}
              </div>
              <p className="text-xs text-gray-500">{item.id}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleColor(item.role)}`}>{(item.role || 'admin').replace('_', ' ')}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEdit(item)} className="text-xs text-electric-400">Edit</button>
            {!isSelf && <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="text-xs text-red-400">Remove</button>}
          </div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{item.id}</span>
            {isSelf && <span className="text-[10px] px-1.5 py-0.5 rounded bg-electric-500/10 text-electric-400">You</span>}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-300">{item.name}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleColor(item.role)}`}>{(item.role || 'admin').replace('_', ' ')}</span></td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${item.active !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.active !== false ? 'Active' : 'Disabled'}</span></td>
        <td className="px-4 py-3"><div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
          {!isSelf && <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>}
        </div></td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Admins" description="Manage admin access" actionLabel="Add Admin" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['id', 'name']} renderRow={renderRow} emptyTitle="No admins" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Admin' : 'Add Admin'}>
        <div className="space-y-4">
          {!editId && (
            <FormInput label="Email (Google account)" placeholder="user@gmail.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          )}
          {editId && <p className="text-sm text-gray-400">{editId}</p>}
          <FormInput label="Name" placeholder="Display name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormSelect label="Role" options={roleOptions} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <FormToggle label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} description="Inactive admins cannot access the panel" />
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Admin'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Remove Admin?" message="This person will lose access to the admin panel." confirmText="Remove" loading={deleting} />
    </div>
  )
}
