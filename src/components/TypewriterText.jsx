import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TypewriterText({ text, delay = 0, speed = 80, className = '' }) {
  const [displayedText, setDisplayedText] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayedText.length >= text.length) return

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1))
    }, speed)

    return () => clearTimeout(timer)
  }, [started, displayedText, text, speed])

  return (
    <span className={className}>
      {displayedText}
      {started && displayedText.length < text.length && (
        <motion.span
          className="inline-block w-[3px] h-[0.85em] bg-electric-400 ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
      {displayedText.length >= text.length && (
        <motion.span
          className="inline-block w-[3px] h-[0.85em] bg-electric-400 ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }}
          initial={{ opacity: 1 }}
        />
      )}
    </span>
  )
}
