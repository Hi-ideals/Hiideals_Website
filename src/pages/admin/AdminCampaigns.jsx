import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormSelect, FormToggle } from '../../components/admin/FormInput'
import { HiPencil, HiTrash } from 'react-icons/hi'

const typeOptions = ['email', 'sms', 'push', 'social']
const statusOptions = ['draft', 'scheduled', 'active', 'paused', 'completed']
const audienceOptions = ['all', 'subscribers', 'clients', 'leads', 'custom']

const emptyForm = { name: '', description: '', type: 'email', status: 'draft', audience: 'all', content: '', active: true }

export default function AdminCampaigns() {
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
    try { setItems(await fetchCollection('campaigns', 'createdAt')) }
    catch { toast.error('Failed to load') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ name: item.name || '', description: item.description || '', type: item.type || 'email', status: item.status || 'draft', audience: item.audience || 'all', content: item.content || '', active: item.active !== false })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      await saveDoc('campaigns', form, editId)
      toast.success(editId ? 'Updated' : 'Created')
      setModalOpen(false); load()
    } catch { toast.error('Failed') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('campaigns', deleteId); toast.success('Deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed') }
    setDeleting(false)
  }

  const statusColor = (s) => {
    if (s === 'active') return 'bg-green-500/10 text-green-400'
    if (s === 'scheduled') return 'bg-blue-500/10 text-blue-400'
    if (s === 'paused') return 'bg-yellow-500/10 text-yellow-400'
    if (s === 'completed') return 'bg-gray-500/10 text-gray-400'
    return 'bg-white/[0.04] text-gray-400'
  }

  const columns = [
    { key: 'name', label: 'Campaign' },
    { key: 'type', label: 'Type' },
    { key: 'audience', label: 'Audience' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-500 capitalize">{item.type} · {item.audience}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(item.status)}`}>{item.status}</span>
          </div>
          <div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-xs text-electric-400">Edit</button><button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="text-xs text-red-400">Delete</button></div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3">
          <p className="text-sm text-white font-medium">{item.name}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
        </td>
        <td className="px-4 py-3 text-xs text-gray-400 capitalize">{item.type}</td>
        <td className="px-4 py-3 text-xs text-gray-400 capitalize">{item.audience}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(item.status)}`}>{item.status}</span></td>
        <td className="px-4 py-3"><div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
          <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
        </div></td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Campaigns" description="Manage marketing campaigns" actionLabel="New Campaign" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['name', 'description']} renderRow={renderRow} emptyTitle="No campaigns" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Campaign' : 'New Campaign'}>
        <div className="space-y-4">
          <FormInput label="Name" placeholder="Campaign name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormTextarea label="Description" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect label="Type" options={typeOptions} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <FormSelect label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
            <FormSelect label="Audience" options={audienceOptions} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
          </div>
          <FormTextarea label="Content" placeholder="Campaign content or template" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <FormToggle label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} />
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Campaign?" loading={deleting} />
    </div>
  )
}
