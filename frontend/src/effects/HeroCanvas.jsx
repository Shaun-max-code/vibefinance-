import { useEffect, useRef } from 'react'

/**
 * HeroCanvas
 * Renders an interactive canvas of floating luminous particles, delicate constellations,
 * and mouse-reactive dynamics for the Hero section.
 */
export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    // Handle high DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Particle pool
    const particleCount = Math.floor(Math.min(width * 0.045, 55))
    const particles = []
    const colors = [
      'rgba(52, 211, 153, ',  // Emerald
      'rgba(56, 189, 248, ',  // Sky cyan
      'rgba(167, 139, 250, ', // Violet
      'rgba(110, 231, 183, ', // Mint
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.4 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        sinOffset: Math.random() * Math.PI * 2,
      })
    }

    // Mouse coordinates relative to canvas
    let mouse = { x: -1000, y: -1000, radius: 120 }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    let time = 0
    const render = () => {
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      // Draw subtle connecting links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 95) {
            const alpha = (1 - dist / 95) * 0.075
            ctx.beginPath()
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Drift
        p.x += p.vx + Math.cos(time + p.sinOffset) * 0.1
        p.y += p.vy + Math.sin(time + p.sinOffset) * 0.1

        // Wrap around boundaries
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Gentle mouse interaction (smooth repulsion)
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < mouse.radius) {
          const force = (1 - mdist / mouse.radius) * 1.8
          p.x += (mdx / (mdist || 1)) * force
          p.y += (mdy / (mdist || 1)) * force
        }

        // Draw particle with soft halo
        const pulseAlpha = p.baseAlpha + Math.sin(time * 2 + p.sinOffset) * 0.12
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.colorBase}${Math.max(0.1, pulseAlpha)})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `${p.colorBase}0.5)`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-particle-canvas"
      aria-hidden="true"
    />
  )
}
