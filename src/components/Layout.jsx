import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AnnouncementBar from './AnnouncementBar'
import WhatsAppButton from './WhatsAppButton'
import BackToTop from './BackToTop'
import PushPrompt from './PushPrompt'
import CookieConsent from './CookieConsent'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'

export default function Layout() {
  const { data: general } = useFirestoreDoc('site_settings', 'general')
  const [hasAnnouncement, setHasAnnouncement] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#050816' }}>
      <AnnouncementBar onVisibilityChange={setHasAnnouncement} />
      <Navbar hasAnnouncement={hasAnnouncement} />
      <main className={hasAnnouncement ? 'pt-28 lg:pt-32' : 'pt-20 lg:pt-24'}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton phone={general?.phone || '919999999999'} />
      <BackToTop />
      <PushPrompt />
      <CookieConsent />
    </div>
  )
}
