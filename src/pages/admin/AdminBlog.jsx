import { useState, useEffect, lazy, Suspense } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormToggle, FormTagInput } from '../../components/admin/FormInput'
import ImageUpload from '../../components/admin/ImageUpload'
import { HiPencil, HiTrash, HiEye } from 'react-icons/hi'

const ReactQuill = lazy(() => import('react-quill-new'))

const emptyForm = { title: '', slug: '', excerpt: '', content: '', author: '', image: '', tags: [], published: true, active: true }

export default function AdminBlog() {
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
    try { setItems(await fetchCollection('blog_posts', 'createdAt')) }
    catch { toast.error('Failed to load posts') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ title: item.title || '', slug: item.slug || '', excerpt: item.excerpt || '', content: item.content || '', author: item.author || '', image: item.image || '', tags: item.tags || [], published: item.published !== false, active: item.active !== false })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      const slug = form.slug || slugify(form.title)
      const data = { ...form, slug, publishedAt: form.published ? new Date() : null }
      await saveDoc('blog_posts', data, editId)
      toast.success(editId ? 'Post updated' : 'Post created')
      setModalOpen(false)
      load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeDoc('blog_posts', deleteId); toast.success('Post deleted'); setConfirmOpen(false); load() }
    catch { toast.error('Failed to delete') }
    setDeleting(false)
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = d.seconds ? new Date(d.seconds * 1000) : d instanceof Date ? d : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const columns = [
    { key: 'title', label: 'Post' },
    { key: 'author', label: 'Author' },
    { key: 'tags', label: 'Tags' },
    { key: 'published', label: 'Status' },
    { key: 'date', label: 'Date' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">by {item.author} · {formatDate(item.publishedAt || item.createdAt)}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${item.published !== false ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
              {item.published !== false ? 'Published' : 'Draft'}
            </span>
          </div>
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
            {item.image && <img src={item.image} alt="" className="w-10 h-7 rounded object-cover" />}
            <div>
              <p className="text-sm text-white font-medium">{item.title}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{item.excerpt}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.author}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {(item.tags || []).slice(0, 2).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-400">{t}</span>)}
          </div>
        </td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${item.published !== false ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{item.published !== false ? 'Published' : 'Draft'}</span></td>
        <td className="px-4 py-3 text-xs text-gray-400">{formatDate(item.publishedAt || item.createdAt)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
            <button onClick={() => { setDeleteId(item.id); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
          </div>
        </td>
      </>
    )
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  }

  return (
    <div>
      <PageHeader title="Blog Posts" description="Manage blog content" actionLabel="New Post" onAction={openNew} />
      <DataTable columns={columns} data={items} loading={loading} searchable searchKeys={['title', 'author', 'excerpt']} renderRow={renderRow} emptyTitle="No blog posts" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Post' : 'New Post'} size="lg">
        <div className="space-y-4">
          <FormInput label="Title" placeholder="Post title" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) }) }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Slug" placeholder="auto-generated" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <FormInput label="Author" placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <FormInput label="Excerpt" placeholder="Brief summary for previews" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Content</label>
            <div className="rounded-xl overflow-hidden border border-white/[0.08] [&_.ql-toolbar]:!bg-white/[0.02] [&_.ql-toolbar]:!border-white/[0.08] [&_.ql-container]:!border-white/[0.08] [&_.ql-editor]:!min-h-[200px] [&_.ql-editor]:!text-white [&_.ql-editor]:!bg-transparent [&_.ql-snow_.ql-stroke]:!stroke-gray-400 [&_.ql-snow_.ql-fill]:!fill-gray-400 [&_.ql-snow_.ql-picker-label]:!text-gray-400 [&_.ql-snow_.ql-picker-options]:!bg-[#111632] [&_.ql-snow_.ql-picker-item]:!text-gray-300">
              <Suspense fallback={<div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">Loading editor...</div>}>
                <ReactQuill theme="snow" value={form.content} onChange={(content) => setForm({ ...form, content })} modules={quillModules} />
              </Suspense>
            </div>
          </div>

          <FormTagInput label="Tags" tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} placeholder="Add tag" />
          <ImageUpload label="Cover Image" hint="Recommended: 1200×630px, JPG or PNG" value={form.image} onChange={(image) => setForm({ ...form, image })} />
          <div className="flex gap-6">
            <FormToggle label="Published" checked={form.published} onChange={(published) => setForm({ ...form, published })} />
            <FormToggle label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{saving ? 'Saving...' : editId ? 'Update' : 'Publish'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Post?" message="This will permanently remove this blog post." loading={deleting} />
    </div>
  )
}
