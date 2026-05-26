import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 80
const ORB_COUNT = 5

export default function Hero3DScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 1.5 : 1)
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 1.5 : 1)
    }
    resize()
    window.addEventListener('resize', resize)

    // particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.0003,
      dy: (Math.random() - 0.5) * 0.0003,
      o: Math.random() * 0.5 + 0.15,
    }))

    // glowing orbs
    const orbs = Array.from({ length: ORB_COUNT }, (_, i) => ({
      x: 0.15 + Math.random() * 0.7,
      y: 0.15 + Math.random() * 0.7,
      r: 60 + Math.random() * 100,
      dx: (Math.random() - 0.5) * 0.00015,
      dy: (Math.random() - 0.5) * 0.00015,
      color: ['59,130,246', '139,92,246', '6,182,212', '99,102,241', '168,85,247'][i],
      phase: Math.random() * Math.PI * 2,
    }))

    const draw = (t) => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // draw orbs (soft glowing blobs)
      for (const orb of orbs) {
        orb.x += orb.dx
        orb.y += orb.dy
        if (orb.x < 0.05 || orb.x > 0.95) orb.dx *= -1
        if (orb.y < 0.05 || orb.y > 0.95) orb.dy *= -1

        const pulse = 1 + Math.sin(t * 0.0008 + orb.phase) * 0.15
        const radius = orb.r * pulse
        const grad = ctx.createRadialGradient(
          orb.x * w, orb.y * h, 0,
          orb.x * w, orb.y * h, radius
        )
        grad.addColorStop(0, `rgba(${orb.color}, 0.12)`)
        grad.addColorStop(0.5, `rgba(${orb.color}, 0.04)`)
        grad.addColorStop(1, `rgba(${orb.color}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(orb.x * w, orb.y * h, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // draw particles
      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > 1) p.dx *= -1
        if (p.y < 0 || p.y > 1) p.dy *= -1

        const flicker = 0.7 + Math.sin(t * 0.002 + p.x * 10) * 0.3
        ctx.fillStyle = `rgba(148,163,230,${p.o * flicker})`
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // draw connection lines between close particles
      ctx.strokeStyle = 'rgba(96,165,250,0.04)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x - particles[j].x) * w
          const dy = (particles[i].y - particles[j].y) * h
          const dist = dx * dx + dy * dy
          if (dist < 12000) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x * w, particles[i].y * h)
            ctx.lineTo(particles[j].x * w, particles[j].y * h)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}
