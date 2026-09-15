import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiExternalLink, HiArrowRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function ProductModal({ product, onClose }) {
  if (!product) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-sky-100"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <HiX className="w-5 h-5" />
          </button>

          {/* Image */}
          {product.image && (
            <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-extrabold text-gray-900">{product.name}</h2>
              {product.status && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  product.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  product.status === 'Beta' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-sky-50 text-sky-600 border border-sky-200'
                }`}>{product.status}</span>
              )}
            </div>

            {product.tagline && (
              <p className="text-sky-600 font-semibold text-sm mb-3">{product.tagline}</p>
            )}

            {product.category && (
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 mb-4">{product.category}</span>
            )}

            {/* Full description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-sm text-justify">{product.description}</p>

            {/* Tech stack */}
            {product.tech && product.tech.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tech.map(t => (
                    <span key={t} className="px-3 py-1 rounded-lg text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Features if available */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Key Features</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg"
                >
                  <HiExternalLink className="w-4 h-4" /> View Live Demo
                </a>
              )}
              <Link
                to="/contact"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-sky-600 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                Inquire About This Product <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
