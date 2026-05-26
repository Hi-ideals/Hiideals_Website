import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormSelect, FormToggle, FormTagInput } from '../../components/admin/FormInput'
import ImageUpload from '../../components/admin/ImageUpload'
import { HiPencil, HiTrash, HiExternalLink } from 'react-icons/hi'

const statusOptions = ['Live', 'Beta', 'In Development', 'Archived']
const categoryOptions = ['SaaS', 'Mobile App', 'Web App', 'Desktop', 'API', 'Plugin', 'Other']

const emptyForm = { name: '', tagline: '', description: '', category: 'SaaS', status: 'Live', image: '', url: '', tech: [], active: true, order: 1 }

export default function AdminProducts() {
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
    try { setItems(await fetchCollection('products')) }
    catch { toast.error('Failed to load products') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ name: item.name || '', tagline: item.tagline || '', description: item.description || '', category: item.category || 'SaaS', status: item.status || 'Live', image: item.image || '', url: item.url || '', tech: item.tech || [], active: item.active !== false, order: item.order || 1 })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Product name is required')
    setSaving(true)
    try {
      await saveDoc('products', { ...form }, editId)
      toast.success(editId ? 'Product updated' : 'Product created')
      setModalOpen(false)
      load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('products', deleteId); toast.success('Product deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed to delete') }
    setDeleting(false)
  }

  const statusColor = (s) => {
    if (s === 'Live') return 'bg-green-500/10 text-green-400'
    if (s === 'Beta') return 'bg-yellow-500/10 text-yellow-400'
    if (s === 'In Development') return 'bg-blue-500/10 text-blue-400'
    return 'bg-gray-500/10 text-gray-400'
  }

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'tech', label: 'Tech Stack' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.tagline}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>{item.status}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(item.tech || []).slice(0, 3).map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-400">{t}</span>)}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => openEdit(item)} className="text-xs text-electric-400 hover:underline">Edit</button>
            <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="text-xs text-red-400 hover:underline">Delete</button>
          </div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
            <div>
              <p className="text-sm text-white font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">{item.tagline}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.category}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>{item.status}</span></td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {(item.tech || []).slice(0, 3).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-400">{t}</span>)}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiExternalLink className="w-4 h-4" /></a>}
            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
            <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
          </div>
        </td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Products" description="Manage your product showcase" actionLabel="Add Product" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['name', 'tagline', 'category']} renderRow={renderRow} emptyTitle="No products yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Product' : 'New Product'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Name" placeholder="e.g. GymOS" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormInput label="Tagline" placeholder="Short tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <FormSelect label="Category" options={categoryOptions} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <FormSelect label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <div className="md:col-span-2"><FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="md:col-span-2"><FormTagInput label="Tech Stack" tags={form.tech} onChange={(tech) => setForm({ ...form, tech })} placeholder="e.g. React" /></div>
          <FormInput label="URL" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <FormInput label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <div className="md:col-span-2"><ImageUpload label="Screenshot" value={form.image} onChange={(image) => setForm({ ...form, image })} /></div>
          <div className="md:col-span-2"><FormToggle label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-white/[0.06]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Product?" message="This will permanently remove this product." loading={deleting} />
    </div>
  )
}
