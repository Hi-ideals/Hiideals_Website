import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Loader from './components/Loader'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Products = lazy(() => import('./pages/Products'))
const CaseStudies = lazy(() => import('./pages/CaseStudies'))
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'))
const Careers = lazy(() => import('./pages/Careers'))
const CareerDetail = lazy(() => import('./pages/CareerDetail'))
const Internships = lazy(() => import('./pages/Internships'))
const InternshipDetail = lazy(() => import('./pages/InternshipDetail'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Pricing = lazy(() => import('./pages/Pricing'))
const CampaignPage = lazy(() => import('./pages/CampaignPage'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminCaseStudies = lazy(() => import('./pages/admin/AdminCaseStudies'))
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'))
const AdminInternships = lazy(() => import('./pages/admin/AdminInternships'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'))
const AdminCampaigns = lazy(() => import('./pages/admin/AdminCampaigns'))
const AdminAdmins = lazy(() => import('./pages/admin/AdminAdmins'))
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'))

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<CareerDetail />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/campaigns/:id" element={<CampaignPage />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin login — no layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin dashboard — protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="internships" element={<AdminInternships />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="admins" element={<AdminAdmins />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
