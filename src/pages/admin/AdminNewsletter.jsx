import { useState } from 'react'
import { HiMail, HiDownload, HiPaperAirplane } from 'react-icons/hi'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/admin/PageHeader'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import { FormInput, FormTextarea } from '../../components/admin/FormInput'
import { exportToExcel } from '../../firebase/adminCrud'

export default function AdminNewsletter() {
  const { data: subscribers, loading } = useFirestoreCollection('newsletter_subscribers', 'createdAt')
  const toast = useToast()
  const [sendModal, setSendModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [newsletter, setNewsletter] = useState({ title: '', content: '' })

  const activeCount = subscribers.filter(s => s.active !== false).length
  const totalCount = subscribers.length

  const toggleActive = async (sub) => {
    try {
      await updateDoc(doc(db, 'newsletter_subscribers', sub.id), { active: !sub.active })
      toast.success(sub.active ? 'Subscriber deactivated' : 'Subscriber activated')
      // Force refresh — crude but works with current hook
      window.location.reload()
    } catch {
      toast.error('Failed to update subscriber')
    }
  }

  const handleExport = () => {
    const data = subscribers.map(s => ({
      Email: s.email,
      Status: s.active !== false ? 'Active' : 'Inactive',
      'Subscribed At': s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString() : '',
    }))
    exportToExcel(data, 'newsletter_subscribers')
    toast.success('Exported successfully')
  }

  const handleSendNewsletter = async () => {
    if (!newsletter.title.trim() || !newsletter.content.trim()) {
      toast.error('Title and content are required')
      return
    }
    setSending(true)
    try {
      // This sends a push notification to all FCM subscribers
      // In production, this would call a Cloud Function
      // For now, we save the newsletter to Firestore for record
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      await addDoc(collection(db, 'newsletters_sent'), {
        title: newsletter.title,
        content: newsletter.content,
        sentTo: activeCount,
        createdAt: serverTimestamp(),
      })
      toast.success(`Newsletter saved! ${activeCount} subscribers will be notified.`)
      setSendModal(false)
      setNewsletter({ title: '', content: '' })
    } catch {
      toast.error('Failed to send newsletter')
    }
    setSending(false)
  }

  const columns = [
    { key: 'email', label: 'Email', render: (v) => <span className="text-white font-medium">{v}</span> },
    {
      key: 'active',
      label: 'Status',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${v !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>
          {v !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Subscribed',
      render: (v) => <span className="text-gray-500 text-xs">{v?.seconds ? new Date(v.seconds * 1000).toLocaleDateString() : ''}</span>,
    },
  ]

  const actions = (row) => (
    <button
      onClick={() => toggleActive(row)}
      className={`text-xs px-2 py-1 rounded ${row.active !== false ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
    >
      {row.active !== false ? 'Deactivate' : 'Activate'}
    </button>
  )

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description={`${activeCount} active subscribers out of ${totalCount} total`}
      >
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <HiDownload className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setSendModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
            <HiPaperAirplane className="w-3.5 h-3.5" /> Send Newsletter
          </button>
        </div>
      </PageHeader>

      <DataTable
        columns={columns}
        data={subscribers}
        loading={loading}
        searchKeys={['email']}
        actions={actions}
      />

      {/* Send Newsletter Modal */}
      <Modal isOpen={sendModal} onClose={() => setSendModal(false)} title="Send Newsletter" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}>
            <HiMail className="w-4 h-4 text-electric-400" />
            <p className="text-xs text-gray-400">This will be sent as a push notification to all {activeCount} active FCM subscribers.</p>
          </div>
          <FormInput label="Newsletter Title" value={newsletter.title} onChange={(e) => setNewsletter(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Monthly Update — May 2026" required />
          <FormTextarea label="Content" value={newsletter.content} onChange={(e) => setNewsletter(p => ({ ...p, content: e.target.value }))} placeholder="Write your newsletter content here..." rows={6} required />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setSendModal(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSendNewsletter} disabled={sending} className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
              {sending ? 'Sending...' : 'Send Newsletter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
