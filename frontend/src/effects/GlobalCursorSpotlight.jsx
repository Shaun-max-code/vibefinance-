import { useEffect, useRef } from 'react'

/**
 * GlobalCursorSpotlight
 * Soft ambient light that gently glides behind the cursor across the application,
 * creating an ultra-premium, tactile interactive experience.
 */
export default function GlobalCursorSpotlight() {
  const spotlightRef = useRef(null)

  useEffect(() => {
    const el = spotlightRef.current
    if (!el) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY
    let isVisible = false
    let rafId = null

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) {
        isVisible = true
        if (el) el.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      isVisible = false
      if (el) el.style.opacity = '0'
    }

    // Smooth lerp (linear interpolation) loop for silky fluid motion
    const animate = () => {
      currentX += (mouseX - currentX) * 0.12
      currentY += (mouseY - currentY) * 0.12

      if (el) {
        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={spotlightRef}
      className="global-cursor-spotlight"
      style={{ opacity: 0 }}
      aria-hidden="true"
    />
  )
}
