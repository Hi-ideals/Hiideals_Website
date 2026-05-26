import { motion } from 'framer-motion'

export default function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto mb-14 lg:mb-20"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {label && (
        <span
          className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] mb-5"
          style={{
            color: '#60a5fa',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))',
            border: '1px solid rgba(59,130,246,0.12)',
          }}
        >
          {label}
        </span>
      )}
      <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-5 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
