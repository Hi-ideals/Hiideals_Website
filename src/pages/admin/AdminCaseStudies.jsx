import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormToggle, FormTagInput } from '../../components/admin/FormInput'
import ImageUpload from '../../components/admin/ImageUpload'
import { HiPencil, HiTrash } from 'react-icons/hi'

const emptyForm = { title: '', slug: '', client: '', description: '', challenge: '', solution: '', results: '', tech: [], image: '', active: true, order: 1 }

export default function AdminCaseStudies() {
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
    try { setItems(await fetchCollection('case_studies')) }
    catch { toast.error('Failed to load') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ title: item.title || '', slug: item.slug || '', client: item.client || '', description: item.description || '', challenge: item.challenge || '', solution: item.solution || '', results: item.results || '', tech: item.tech || [], image: item.image || '', active: item.active !== false, order: item.order || 1 })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      await saveDoc('case_studies', { ...form, slug: form.slug || slugify(form.title) }, editId)
      toast.success(editId ? 'Case study updated' : 'Case study created')
      setModalOpen(false); load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('case_studies', deleteId); toast.success('Deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed to delete') }
    setDeleting(false)
  }

  const columns = [
    { key: 'title', label: 'Project' },
    { key: 'client', label: 'Client' },
    { key: 'tech', label: 'Tech' },
    { key: 'active', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white">{item.title}</p>
          <p className="text-xs text-gray-500">{item.client} · {(item.tech || []).join(', ')}</p>
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
          <p className="text-sm text-white font-medium">{item.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
        </td>
        <td className="px-4 py-3 text-sm text-gray-400">{item.client}</td>
        <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(item.tech || []).slice(0, 3).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-400">{t}</span>)}</div></td>
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
      <PageHeader title="Case Studies" description="Showcase your portfolio projects" actionLabel="Add Case Study" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['title', 'client']} renderRow={renderRow} emptyTitle="No case studies" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Case Study' : 'New Case Study'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Title" placeholder="Project name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />
            <FormInput label="Client" placeholder="Client name" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          </div>
          <FormInput label="Slug" placeholder="auto-generated" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <FormTextarea label="Description" placeholder="Brief overview" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <FormTextarea label="Challenge" placeholder="What was the problem?" value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
          <FormTextarea label="Solution" placeholder="How did you solve it?" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
          <FormTextarea label="Results" placeholder="Key outcomes and metrics" value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} />
          <FormTagInput label="Tech Stack" tags={form.tech} onChange={(tech) => setForm({ ...form, tech })} />
          <ImageUpload label="Image" value={form.image} onChange={(image) => setForm({ ...form, image })} />
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

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Case Study?" loading={deleting} />
    </div>
  )
}
