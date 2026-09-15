import { motion } from 'framer-motion'
import Hero3DScene from './Hero3DScene'

export default function HeroBackground() {
  return (
    <>
      {/* Main gradient — richer sky blue */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 20%, #e0f2fe 40%, #f0f9ff 60%, #bae6fd 80%, #e0f2fe 100%)' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(9,160,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(9,160,231,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[120px]"
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle, rgba(9,160,231,0.35), transparent 70%)' }} />

      <motion.div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
        animate={{ scale: [1, 1.08, 1], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ background: 'radial-gradient(circle, rgba(34,191,248,0.3), transparent 70%)' }} />

      <motion.div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full blur-[90px]"
        animate={{ scale: [1, 1.06, 1], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ background: 'radial-gradient(circle, rgba(111,208,250,0.3), transparent 70%)' }} />

      {/* Floating decorative shapes */}
      <motion.div className="absolute top-[15%] left-[8%] w-3 h-3 rounded-full bg-sky-400/40"
        animate={{ y: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute top-[60%] left-[5%] w-2 h-2 rounded-full bg-sky-500/30"
        animate={{ y: [10, -10, 10], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
      <motion.div className="absolute top-[25%] right-[12%] w-4 h-4 rounded-full bg-sky-300/30"
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-[20%] right-[8%] w-2.5 h-2.5 rounded-full bg-sky-400/25"
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />

      {/* Floating rings */}
      <motion.div className="absolute top-[40%] left-[15%] w-16 h-16 rounded-full border-2 border-sky-300/20"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }} />
      <motion.div className="absolute bottom-[30%] right-[20%] w-10 h-10 rounded-full border border-sky-400/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />

      <Hero3DScene />
    </>
  )
}
