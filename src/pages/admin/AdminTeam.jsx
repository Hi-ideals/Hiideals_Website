import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormToggle } from '../../components/admin/FormInput'
import ImageUpload from '../../components/admin/ImageUpload'
import { HiPencil, HiTrash } from 'react-icons/hi'

const emptyForm = { name: '', role: '', bio: '', photo: '', linkedin: '', github: '', active: true, order: 1 }

export default function AdminTeam() {
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
    try { setItems(await fetchCollection('team')) }
    catch { toast.error('Failed to load team') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ name: item.name || '', role: item.role || '', bio: item.bio || '', photo: item.photo || '', linkedin: item.linkedin || '', github: item.github || '', active: item.active !== false, order: item.order || 1 })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      await saveDoc('team', { ...form }, editId)
      toast.success(editId ? 'Member updated' : 'Member added')
      setModalOpen(false)
      load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('team', deleteId); toast.success('Member deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed to delete') }
    setDeleting(false)
  }

  const columns = [
    { key: 'name', label: 'Member' },
    { key: 'role', label: 'Role' },
    { key: 'active', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="flex items-center gap-3">
          {item.photo ? <img src={item.photo} alt="" className="w-10 h-10 rounded-xl object-cover" /> : <div className="w-10 h-10 rounded-xl bg-electric-500/10 flex items-center justify-center text-electric-400 font-bold text-sm">{item.name?.[0]}</div>}
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{item.name}</p>
            <p className="text-xs text-gray-500">{item.role}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEdit(item)} className="text-xs text-electric-400">Edit</button>
            <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="text-xs text-red-400">Delete</button>
          </div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {item.photo ? <img src={item.photo} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center text-electric-400 font-bold text-xs">{item.name?.[0]}</div>}
            <span className="text-sm text-white font-medium">{item.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-400">{item.role}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${item.active !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.active !== false ? 'Active' : 'Inactive'}</span></td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
            <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
          </div>
        </td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Team" description="Manage team members" actionLabel="Add Member" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['name', 'role']} renderRow={renderRow} emptyTitle="No team members" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Member' : 'New Member'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Name" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormInput label="Role" placeholder="e.g. CTO" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <FormTextarea label="Bio" placeholder="Short bio..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <ImageUpload label="Photo" value={form.photo} onChange={(photo) => setForm({ ...form, photo })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="LinkedIn URL" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            <FormInput label="GitHub URL" placeholder="https://github.com/..." value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><FormToggle label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Member?" message="This will permanently remove this team member." loading={deleting} />
    </div>
  )
}
