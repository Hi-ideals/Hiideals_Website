import { useState, useEffect } from 'react'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { useToast } from '../../context/ToastContext'
import { fetchDoc, saveDoc, fetchCollection, removeDoc } from '../../firebase/adminCrud'
import PageHeader from '../../components/admin/PageHeader'
import { FormInput, FormTextarea, FormToggle } from '../../components/admin/FormInput'
import ImageUpload from '../../components/admin/ImageUpload'

const defaultSettings = {
  general: { companyName: '', tagline: '', email: '', phone: '', address: '', founded: '', logo: '', linkedin: '', instagram: '', twitter: '', mission: '', vision: '' },
  homepage: { showServices: true, showProducts: true, showTestimonials: true, showBlog: true, showCareers: true, showClients: true, showCTA: true, heroBadge: '', heroTitle1: '', heroTitle2: '', heroDescription: '' },
  seo: { metaTitle: '', metaDescription: '', ogImage: '' },
}

export default function AdminSettings() {
  const toast = useToast()
  const [tab, setTab] = useState('general')
  const [settings, setSettings] = useState(defaultSettings)
  const [clientLogos, setClientLogos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = {}
      for (const key of ['general', 'homepage', 'seo']) {
        const doc = await fetchDoc('site_settings', key)
        data[key] = doc ? { ...defaultSettings[key], ...doc } : defaultSettings[key]
      }
      setSettings(data)
      let logos = await fetchCollection('client_logos', 'order')
      if (logos.length === 0 && data.homepage.clientLogos?.length > 0) {
        for (let i = 0; i < data.homepage.clientLogos.length; i++) {
          const cl = data.homepage.clientLogos[i]
          const id = `client-migrated-${i}`
          await saveDoc('client_logos', { name: cl.name || '', logo: cl.logo || '', order: i }, id)
          logos.push({ id, name: cl.name || '', logo: cl.logo || '', order: i })
        }
        const { clientLogos: _, ...cleanHomepage } = data.homepage
        await saveDoc('site_settings', cleanHomepage, 'homepage')
        data.homepage = cleanHomepage
        toast.success(`Migrated ${logos.length} client logos to new storage`)
      }
      setClientLogos(logos)
    } catch { toast.error('Failed to load settings') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateField = (section, field, value) => {
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const compressLogo = async (dataUrl) => {
    const MAX_LOGO_WIDTH = 200
    if (!dataUrl || !dataUrl.startsWith('data:image')) return dataUrl
    try {
      const img = new window.Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = dataUrl
      })
      if (img.width <= MAX_LOGO_WIDTH) return dataUrl
      const canvas = document.createElement('canvas')
      const ratio = MAX_LOGO_WIDTH / img.width
      canvas.width = MAX_LOGO_WIDTH
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const isPng = dataUrl.startsWith('data:image/png')
      return isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.7)
    } catch { return dataUrl }
  }

  const saveClientLogo = async (logo, index) => {
    try {
      const compressed = await compressLogo(logo.logo)
      const data = { name: logo.name || '', logo: compressed || '', order: index }
      const id = logo.id || `client-${Date.now()}-${index}`
      await saveDoc('client_logos', data, id)
      return { ...data, id }
    } catch (e) {
      console.error('Failed to save logo:', e)
      throw e
    }
  }

  const deleteClientLogo = async (logo) => {
    if (!logo.id) return
    try {
      await removeDoc('client_logos', logo.id)
    } catch (e) {
      console.error('Failed to delete logo:', e)
      throw e
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (tab === 'homepage') {
        const { id, clientLogos: _, ...data } = settings[tab]
        await saveDoc('site_settings', data, tab)
        const savedLogos = []
        for (let i = 0; i < clientLogos.length; i++) {
          const saved = await saveClientLogo(clientLogos[i], i)
          savedLogos.push(saved)
        }
        setClientLogos(savedLogos)
        setSettings(prev => ({ ...prev, [tab]: { ...data, id: tab } }))
      } else {
        const { id, ...data } = settings[tab]
        await saveDoc('site_settings', data, tab)
        setSettings(prev => ({ ...prev, [tab]: { ...data, id: tab } }))
      }
      toast.success('Settings saved')
    } catch (e) {
      console.error('Save error:', e)
      toast.error('Failed to save')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-electric-500/30 border-t-electric-500 rounded-full animate-spin" />
      </div>
    )
  }

  const s = settings[tab]

  return (
    <div>
      <PageHeader title="Site Settings" description="Configure your website settings" />

      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] w-fit">
        {['general', 'homepage', 'seo'].map((key) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === key ? 'bg-electric-500/10 text-electric-400' : 'text-gray-500 hover:text-white'}`}>{key}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.06] p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {tab === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <ImageUpload label="Company Logo" hint="Recommended: 200×200px, PNG with transparent bg" value={s.logo || ''} onChange={(logo) => updateField('general', 'logo', logo)} />
            <FormInput label="Company Name" value={s.companyName || ''} onChange={(e) => updateField('general', 'companyName', e.target.value)} />
            <FormTextarea label="Tagline" value={s.tagline || ''} onChange={(e) => updateField('general', 'tagline', e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Email" value={s.email || ''} onChange={(e) => updateField('general', 'email', e.target.value)} />
              <FormInput label="Phone" value={s.phone || ''} onChange={(e) => updateField('general', 'phone', e.target.value)} />
            </div>
            <FormInput label="Address" value={s.address || ''} onChange={(e) => updateField('general', 'address', e.target.value)} />
            <FormInput label="Founded" value={s.founded || ''} onChange={(e) => updateField('general', 'founded', e.target.value)} />
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-white mb-3">About Page</h3>
              <div className="space-y-3">
                <FormTextarea label="Mission Statement" placeholder="To empower businesses with..." value={s.mission || ''} onChange={(e) => updateField('general', 'mission', e.target.value)} />
                <FormTextarea label="Vision Statement" placeholder="To become the most trusted..." value={s.vision || ''} onChange={(e) => updateField('general', 'vision', e.target.value)} />
              </div>
            </div>
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-white mb-3">Social Links</h3>
              <div className="space-y-3">
                <FormInput label="LinkedIn" placeholder="https://linkedin.com/company/..." value={s.linkedin || ''} onChange={(e) => updateField('general', 'linkedin', e.target.value)} />
                <FormInput label="Instagram" placeholder="https://instagram.com/..." value={s.instagram || ''} onChange={(e) => updateField('general', 'instagram', e.target.value)} />
                <FormInput label="Twitter / X" placeholder="https://x.com/..." value={s.twitter || ''} onChange={(e) => updateField('general', 'twitter', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {tab === 'homepage' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Section Visibility</h3>
              <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                {['showServices', 'showProducts', 'showTestimonials', 'showBlog', 'showCareers', 'showClients', 'showCTA'].map((key) => (
                  <FormToggle key={key} label={key.replace('show', '').replace('CTA', 'CTA Banner')} checked={s[key] !== false} onChange={(val) => updateField('homepage', key, val)} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Hero Section</h3>
              <FormInput label="Badge Text" value={s.heroBadge || ''} onChange={(e) => updateField('homepage', 'heroBadge', e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Title Line 1" value={s.heroTitle1 || ''} onChange={(e) => updateField('homepage', 'heroTitle1', e.target.value)} />
                <FormInput label="Title Line 2" value={s.heroTitle2 || ''} onChange={(e) => updateField('homepage', 'heroTitle2', e.target.value)} />
              </div>
              <FormTextarea label="Description" value={s.heroDescription || ''} onChange={(e) => updateField('homepage', 'heroDescription', e.target.value)} />
            </div>

            {/* Client Logos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Client Logos</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Shown in the scrolling marquee on the homepage ({clientLogos.length} clients)</p>
                </div>
                <button type="button" onClick={() => {
                  setClientLogos(prev => [...prev, { name: '', logo: '', order: prev.length }])
                }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-electric-400 bg-electric-500/10 hover:bg-electric-500/20 transition-colors">
                  <HiPlus className="w-3.5 h-3.5" /> Add Client
                </button>
              </div>
              {clientLogos.length === 0 && (
                <p className="text-xs text-gray-600 py-4 text-center border border-dashed border-white/[0.08] rounded-xl">No client logos added yet. Click "Add Client" to start.</p>
              )}
              <div className="space-y-3">
                {clientLogos.map((client, idx) => (
                  <div key={client.id || idx} className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-24 shrink-0">
                      <ImageUpload
                        label=""
                        hint="160×60px, PNG"
                        maxWidth={200}
                        value={client.logo || ''}
                        onChange={(logo) => {
                          setClientLogos(prev => {
                            const next = [...prev]
                            next[idx] = { ...next[idx], logo }
                            return next
                          })
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <FormInput
                        label="Client Name"
                        placeholder="e.g. Acme Corp"
                        value={client.name || ''}
                        onChange={(e) => {
                          setClientLogos(prev => {
                            const next = [...prev]
                            next[idx] = { ...next[idx], name: e.target.value }
                            return next
                          })
                        }}
                      />
                    </div>
                    <button type="button" onClick={async () => {
                      if (client.id) {
                        try {
                          await deleteClientLogo(client)
                        } catch {
                          toast.error('Failed to delete')
                          return
                        }
                      }
                      setClientLogos(prev => prev.filter((_, i) => i !== idx))
                      toast.success('Client removed')
                    }} className="mt-6 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="space-y-4 max-w-2xl">
            <FormInput label="Meta Title" value={s.metaTitle || ''} onChange={(e) => updateField('seo', 'metaTitle', e.target.value)} />
            <FormTextarea label="Meta Description" value={s.metaDescription || ''} onChange={(e) => updateField('seo', 'metaDescription', e.target.value)} />
            <FormInput label="OG Image URL" placeholder="https://..." value={s.ogImage || ''} onChange={(e) => updateField('seo', 'ogImage', e.target.value)} />
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-white/[0.06]">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
