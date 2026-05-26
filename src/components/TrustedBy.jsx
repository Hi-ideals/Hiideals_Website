import { motion } from 'framer-motion'

const logos = [
  { name: 'TechCorp', color: '#3b82f6' },
  { name: 'DataFlow', color: '#8b5cf6' },
  { name: 'CloudBase', color: '#06b6d4' },
  { name: 'InnoSoft', color: '#3b82f6' },
  { name: 'DigitalEdge', color: '#8b5cf6' },
  { name: 'NetPrime', color: '#06b6d4' },
]

export default function TrustedBy() {
  return (
    <section className="relative py-10 sm:py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050816 0%, #0a0f2e 50%, #050816 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center gap-4 mb-10 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
            Trusted by innovators
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-white/10" />
        </motion.div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              className="group relative flex items-center justify-center py-5 px-4 rounded-2xl cursor-default transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{
                y: -4,
                boxShadow: `0 20px 40px -10px ${logo.color}15`,
                borderColor: `${logo.color}20`,
                background: `linear-gradient(135deg, ${logo.color}08, transparent)`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${logo.color}15, ${logo.color}05)`,
                    border: `1px solid ${logo.color}15`,
                    color: logo.color,
                  }}
                >
                  {logo.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors hidden sm:block">
                  {logo.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
