import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { fetchCollection, saveDoc, removeDoc, exportToExcel } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { FormInput, FormTextarea, FormSelect, FormToggle, FormTagInput } from '../../components/admin/FormInput'
import { HiPencil, HiTrash, HiDownload, HiEye } from 'react-icons/hi'

const typeOptions = ['Full-time', 'Part-time', 'Contract', 'Freelance']
const deptOptions = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Support']
const emptyForm = { title: '', type: 'Full-time', location: '', department: 'Engineering', description: '', requirements: [], salary: '', applyUrl: '', active: true, order: 1 }

export default function AdminCareers() {
  const toast = useToast()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('jobs') // jobs | applications
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteType, setDeleteType] = useState('job') // 'job' | 'application'
  const [deleting, setDeleting] = useState(false)
  const [viewApp, setViewApp] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [j, a] = await Promise.all([
        fetchCollection('careers'),
        fetchCollection('job_applications', 'createdAt'),
      ])
      setJobs(j)
      setApplications(a)
    } catch { toast.error('Failed to load') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ title: item.title || '', type: item.type || 'Full-time', location: item.location || '', department: item.department || 'Engineering', description: item.description || '', requirements: item.requirements || [], salary: item.salary || '', applyUrl: item.applyUrl || '', active: item.active !== false, order: item.order || 1 })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      await saveDoc('careers', form, editId)
      toast.success(editId ? 'Job updated' : 'Job created')
      setModalOpen(false); load()
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const col = deleteType === 'application' ? 'job_applications' : 'careers'
      await removeDoc(col, deleteId)
      toast.success('Deleted')
      setConfirmOpen(false)
      load()
    } catch { toast.error('Failed to delete') }
    setDeleting(false)
  }

  const confirmDeleteApp = (appId) => {
    setDeleteId(appId)
    setDeleteType('application')
    setConfirmOpen(true)
  }

  const confirmDeleteJob = (jobId) => {
    setDeleteId(jobId)
    setDeleteType('job')
    setConfirmOpen(true)
  }

  const updateAppStatus = async (appId, status) => {
    try {
      await saveDoc('job_applications', { status }, appId)
      toast.success(`Application ${status}`)
      load()
    } catch { toast.error('Failed to update') }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Jobs table
  const jobColumns = [
    { key: 'title', label: 'Position' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'department', label: 'Dept' },
    { key: 'active', label: 'Status' },
    { key: 'actions', label: '', width: '100px' },
  ]

  const renderJobRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">{item.title}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${item.active !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.active !== false ? 'Active' : 'Closed'}</span>
          </div>
          <p className="text-xs text-gray-500">{item.type} · {item.location} · {item.department}</p>
          <div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-xs text-electric-400">Edit</button><button onClick={() => confirmDeleteJob(item.id)} className="text-xs text-red-400">Delete</button></div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3 text-sm text-white font-medium">{item.title}</td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.type}</td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.location}</td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.department}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${item.active !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.active !== false ? 'Active' : 'Closed'}</span></td>
        <td className="px-4 py-3"><div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiPencil className="w-4 h-4" /></button>
          <button onClick={() => confirmDeleteJob(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
        </div></td>
      </>
    )
  }

  // Applications table
  const appColumns = [
    { key: 'name', label: 'Applicant' },
    { key: 'position', label: 'Position' },
    { key: 'experience', label: 'Experience' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Applied' },
    { key: 'actions', label: '', width: '120px' },
  ]

  const statusColor = (s) => {
    if (s === 'accepted') return 'bg-green-500/10 text-green-400'
    if (s === 'rejected') return 'bg-red-500/10 text-red-400'
    if (s === 'reviewing') return 'bg-blue-500/10 text-blue-400'
    return 'bg-yellow-500/10 text-yellow-400'
  }

  const renderAppRow = (item, _, isMobile) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.position} · {item.experience}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(item.status)}`}>{item.status || 'pending'}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewApp(item)} className="text-xs text-electric-400">View</button>
            {item.resumeUrl && <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-electric-400">Resume</a>}
            <button onClick={() => confirmDeleteApp(item.id)} className="text-xs text-red-400">Delete</button>
          </div>
        </div>
      )
    }
    return (
      <>
        <td className="px-4 py-3"><div><p className="text-sm text-white font-medium">{item.name}</p><p className="text-xs text-gray-500">{item.email}</p></div></td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.position}</td>
        <td className="px-4 py-3 text-xs text-gray-400">{item.experience}</td>
        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(item.status)}`}>{item.status || 'pending'}</span></td>
        <td className="px-4 py-3 text-xs text-gray-400">{formatDate(item.createdAt)}</td>
        <td className="px-4 py-3"><div className="flex items-center gap-1">
          <button onClick={() => setViewApp(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiEye className="w-4 h-4" /></button>
          {item.resumeUrl && <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"><HiDownload className="w-4 h-4" /></a>}
          <button onClick={() => confirmDeleteApp(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><HiTrash className="w-4 h-4" /></button>
        </div></td>
      </>
    )
  }

  return (
    <div>
      <PageHeader title="Careers" description="Manage job listings and applications">
        {tab === 'applications' && applications.length > 0 && (
          <button onClick={() => exportToExcel(applications, 'job-applications')} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 border border-white/[0.08] hover:bg-white/[0.04] transition-colors">
            <HiDownload className="w-4 h-4" /> Export Excel
          </button>
        )}
        {tab === 'jobs' && (
          <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>+ Add Job</button>
        )}
      </PageHeader>

      {/* Tab toggle */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-white/[0.03] w-fit">
        {[['jobs', `Jobs (${jobs.length})`], ['applications', `Applications (${applications.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-electric-500/10 text-electric-400' : 'text-gray-500 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      {tab === 'jobs' ? (
        <DataTable columns={jobColumns} data={jobs} loading={loading} searchable searchKeys={['title', 'location']} renderRow={renderJobRow} emptyTitle="No job listings" />
      ) : (
        <DataTable columns={appColumns} data={applications} loading={loading} searchable searchKeys={['name', 'email', 'position']} renderRow={renderAppRow} emptyTitle="No applications" />
      )}

      {/* Job Form Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Job' : 'New Job'}>
        <div className="space-y-4">
          <FormInput label="Title" placeholder="e.g. Full Stack Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect label="Type" options={typeOptions} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <FormSelect label="Department" options={deptOptions} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Location" placeholder="Bidar / Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <FormInput label="Salary" placeholder="Competitive / ₹X LPA" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
          <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <FormTagInput label="Requirements" tags={form.requirements} onChange={(requirements) => setForm({ ...form, requirements })} placeholder="Add requirement" />
          <FormInput label="Apply URL" placeholder="External apply link (optional)" value={form.applyUrl} onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} />
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

      {/* Application Viewer Modal */}
      <Modal open={!!viewApp} onClose={() => setViewApp(null)} title="Application Details">
        {viewApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Name</p><p className="text-sm text-white">{viewApp.name}</p></div>
              <div><p className="text-xs text-gray-500">Email</p><p className="text-sm text-white">{viewApp.email}</p></div>
              <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm text-white">{viewApp.phone}</p></div>
              <div><p className="text-xs text-gray-500">Position</p><p className="text-sm text-white">{viewApp.position}</p></div>
              <div><p className="text-xs text-gray-500">Experience</p><p className="text-sm text-white">{viewApp.experience}</p></div>
              <div><p className="text-xs text-gray-500">Applied</p><p className="text-sm text-white">{formatDate(viewApp.createdAt)}</p></div>
            </div>
            {viewApp.coverLetter && <div><p className="text-xs text-gray-500 mb-1">Cover Letter</p><p className="text-sm text-gray-300 bg-white/[0.02] rounded-xl p-3">{viewApp.coverLetter}</p></div>}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-gray-500">Status:</span>
              {['pending', 'reviewing', 'accepted', 'rejected'].map((s) => (
                <button key={s} onClick={() => { updateAppStatus(viewApp.id, s); setViewApp({ ...viewApp, status: s }) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${viewApp.status === s ? statusColor(s) : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title={deleteType === 'application' ? 'Delete Application?' : 'Delete Job?'} loading={deleting} />
    </div>
  )
}
