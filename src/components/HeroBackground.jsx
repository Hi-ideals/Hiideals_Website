import { motion } from 'framer-motion'
import Hero3DScene from './Hero3DScene'

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(96,165,250,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

function RadialGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse at 40% 50%, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 35%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.06) 0%, transparent 50%)',
        }}
      />
    </div>
  )
}

function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

export default function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[#050816]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #050816 0%, #0a0f2e 30%, #0d1033 50%, #080c20 100%)',
        }}
      />
      <RadialGlow />
      <GridPattern />
      <NoiseOverlay />
      <Hero3DScene />
    </>
  )
}
