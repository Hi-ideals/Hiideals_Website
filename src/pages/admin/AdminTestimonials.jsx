import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormToggle } from '../../components/admin/FormInput'
import ImageUpload from '../../components/admin/ImageUpload'
import { HiPencil, HiTrash, HiStar } from 'react-icons/hi'

const emptyForm = { name: '', company: '', role: '', content: '', rating: 5, photo: '', active: true, order: 1 }

export default function AdminTestimonials() {
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
    try { setItems(await fetchCollection('testimonials')) }
    catch { toast.error('Failed to load testimonials') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ name: item.name || '', company: item.company || '', role: item.role || '', content: item.content || '', rating: item.rating || 5, photo: item.photo || '', active: item.active !== false, order: item.order || 1 })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) return toast.error('Name and content are required')
    setSaving(true)
    try {
      await saveDoc('testimonials', { ...form }, editId)
      toast.success(editId ? 'Testimonial updated' : 'Testimonial added')
      setModalOpen(false)
      load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('testimonials', deleteId); toast.success('Testimonial deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed to delete') }
    setDeleting(false)
  }

  const columns = [
    { key: 'name', label: 'Client' },
    { key: 'company', label: 'Company' },
    { key: 'rating', label: 'Rating' },
    { key: 'active', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
      <HiStar key={i} className={`w-3 h-3 ${i < (item.rating || 5) ? 'text-yellow-400' : 'text-gray-700'}`} />
    ))

    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.role} at {item.company}</p>
            </div>
            <div className="flex">{stars}</div>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">{item.content}</p>
          <div className="flex gap-2 pt-1">
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
            <div>
              <p className="text-sm text-white font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">{item.role}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-400">{item.company}</td>
        <td className="px-4 py-3"><div className="flex">{stars}</div></td>
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
      <PageHeader title="Testimonials" description="Manage client testimonials" actionLabel="Add Testimonial" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['name', 'company']} renderRow={renderRow} emptyTitle="No testimonials" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Testimonial' : 'New Testimonial'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput label="Name" placeholder="Client name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormInput label="Role" placeholder="e.g. CTO" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <FormInput label="Company" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <FormTextarea label="Testimonial" placeholder="What did the client say?" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="p-0.5">
                  <HiStar className={`w-6 h-6 transition-colors ${n <= form.rating ? 'text-yellow-400' : 'text-gray-700 hover:text-yellow-400/50'}`} />
                </button>
              ))}
            </div>
          </div>
          <ImageUpload label="Photo" hint="Recommended: 200×200px, square crop" value={form.photo} onChange={(photo) => setForm({ ...form, photo })} />
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

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Testimonial?" loading={deleting} />
    </div>
  )
}
