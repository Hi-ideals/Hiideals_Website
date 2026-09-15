import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiExternalLink } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const fallbackProjects = [
  { title: 'E-Commerce Platform', category: 'Web', description: 'A full-featured e-commerce platform with payment integration.', tech: ['React', 'Node.js', 'PostgreSQL'] },
  { title: 'Healthcare App', category: 'Mobile', description: 'Patient management and appointment scheduling application.', tech: ['React Native', 'Firebase'] },
  { title: 'Analytics Dashboard', category: 'Web', description: 'Real-time business analytics with interactive charts.', tech: ['React', 'D3.js', 'Python'] },
]

export default function Portfolio() {
  const { data: projects } = useFirestoreCollection('portfolio', 'order')
  const displayProjects = projects.length > 0 ? projects : fallbackProjects

  return (
    <PageTransition>
      <Helmet><title>Portfolio — Hiideals Technologies</title></Helmet>
      <PageBanner title="Our Work" subtitle="A selection of projects we're proud to have delivered." breadcrumbs={[{ label: 'Portfolio' }]} />

      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, i) => (
              <motion.div key={project.id || i} className="group rounded-2xl overflow-hidden bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                {project.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-sky-50">
                    <span className="text-5xl font-black text-sky-200">{project.title?.[0]}</span>
                  </div>
                )}
                <div className="p-6">
                  {project.category && <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 bg-sky-50 text-sky-600 border border-sky-100">{project.category}</span>}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                  {project.tech && <div className="flex flex-wrap gap-1.5 mb-4">{project.tech.map((t, j) => <span key={j} className="px-2 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100">{t}</span>)}</div>}
                  {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 uppercase tracking-wider">View <HiExternalLink className="w-3.5 h-3.5" /></a>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
