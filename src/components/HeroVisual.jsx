import { motion } from 'framer-motion'
import { HiCode, HiCloud, HiDatabase, HiShieldCheck, HiCog, HiDeviceMobile } from 'react-icons/hi'

const floatingIcons = [
  { icon: HiCode, x: '10%', y: '8%', delay: 0, color: '#09a0e7', bg: '#eff8ff' },
  { icon: HiCloud, x: '72%', y: '5%', delay: 0.3, color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: HiDatabase, x: '85%', y: '45%', delay: 0.6, color: '#10b981', bg: '#ecfdf5' },
  { icon: HiShieldCheck, x: '5%', y: '65%', delay: 0.9, color: '#f59e0b', bg: '#fffbeb' },
  { icon: HiCog, x: '65%', y: '80%', delay: 1.2, color: '#ef4444', bg: '#fef2f2' },
  { icon: HiDeviceMobile, x: '40%', y: '90%', delay: 0.5, color: '#06b6d4', bg: '#ecfeff' },
]

const codeLines = [
  { text: 'const app = express()', color: '#09a0e7' },
  { text: 'app.use(cors())', color: '#8b5cf6' },
  { text: 'await db.connect()', color: '#10b981' },
  { text: 'app.listen(3000)', color: '#f59e0b' },
]

export default function HeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
      {/* Main floating code card */}
      <motion.div
        className="absolute top-[10%] left-[5%] right-[5%] max-w-[320px] mx-auto lg:mx-0 lg:left-[8%] rounded-2xl p-5 bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-[10px] text-gray-400 font-mono">server.js</span>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.2 }}
            >
              <span className="text-gray-300 text-[10px] w-4 text-right select-none">{i + 1}</span>
              <span style={{ color: line.color }}>{line.text}</span>
            </motion.div>
          ))}
          <motion.div
            className="flex items-center gap-2 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <span className="text-gray-300 text-[10px] w-4 text-right select-none">5</span>
            <motion.span
              className="inline-block w-2 h-4 bg-sky-500"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats mini card */}
      <motion.div
        className="absolute bottom-[18%] right-[5%] lg:right-[8%] rounded-xl p-4 bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-lg max-w-[180px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <span className="text-emerald-500 text-xs font-bold">✓</span>
          </div>
          <span className="text-xs font-semibold text-gray-900">Build Success</span>
        </div>
        <div className="flex gap-1">
          {[80, 60, 90, 70, 95, 85, 75].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-sky-400"
              style={{ height: `${h * 0.3}px` }}
              initial={{ height: 0 }}
              animate={{ height: `${h * 0.3}px` }}
              transition={{ delay: 1.8 + i * 0.1, duration: 0.4 }}
            />
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">99.9% uptime</p>
      </motion.div>

      {/* Deployment badge */}
      <motion.div
        className="absolute top-[55%] left-[2%] lg:left-[5%] rounded-xl px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-medium text-gray-700">Deployed to Production</span>
        </div>
      </motion.div>

      {/* Floating tech icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-100"
          style={{ left: item.x, top: item.y, background: item.bg }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ delay: 1 + item.delay, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
          </motion.div>
        </motion.div>
      ))}

      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <motion.line
          x1="20%" y1="15%" x2="50%" y2="35%"
          stroke="#09a0e7" strokeWidth="0.5" strokeDasharray="4 4"
          initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
          transition={{ delay: 2 }}
        />
        <motion.line
          x1="80%" y1="12%" x2="55%" y2="30%"
          stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="4 4"
          initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
          transition={{ delay: 2.2 }}
        />
        <motion.line
          x1="90%" y1="50%" x2="70%" y2="45%"
          stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4"
          initial={{ opacity: 0 }} animate={{ opacity: 0.15 }}
          transition={{ delay: 2.4 }}
        />
      </svg>
    </div>
  )
}
