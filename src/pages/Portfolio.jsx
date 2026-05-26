import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiExternalLink } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
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
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e, #050816)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.04)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Portfolio" title="Our Work" subtitle="A selection of projects we're proud to have delivered." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayProjects.map((project, i) => (
              <motion.div key={project.id || i} className="group rounded-2xl overflow-hidden transition-all duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' }}>
                    <span className="text-4xl font-bold text-electric-500/30">{project.title?.[0]}</span>
                  </div>
                )}
                <div className="p-6">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{project.category}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{project.description}</p>
                  {project.tech && <div className="flex flex-wrap gap-1.5 mb-4">{project.tech.map((t, j) => <span key={j} className="px-2 py-0.5 rounded text-xs text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>)}</div>}
                  {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-electric-400 font-medium">View <HiExternalLink className="w-3.5 h-3.5" /></a>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
