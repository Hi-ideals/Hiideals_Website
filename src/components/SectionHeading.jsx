import { motion } from 'framer-motion'

export default function SectionHeading({ label, title, subtitle }) {
  const words = title.split(' ')
  const lastWord = words.pop()
  const firstPart = words.join(' ')

  return (
    <motion.div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20"
      initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-4">
        {firstPart ? <>{firstPart.toUpperCase()} <span className="text-stroke-sky">{lastWord.toUpperCase()}</span></> : <span>{title.toUpperCase()}</span>}
      </h2>
      {subtitle && <p className="text-gray-500 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mt-4">{subtitle}</p>}
    </motion.div>
  )
}
