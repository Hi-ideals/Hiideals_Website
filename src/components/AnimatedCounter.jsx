import { useState, useEffect, useRef, useCallback } from 'react'

export default function AnimatedCounter({ value, suffix = '', duration = 5000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  const target = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, ''), 10)

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [startAnimation])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}
