import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { HiSun, HiMoon } from 'react-icons/hi'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
      </motion.div>
    </motion.button>
  )
}
