import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-6">
        <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-500"
          animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="text-white font-bold text-xl">H</span>
        </motion.div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
