import React, { useRef, useState } from 'react'

/**
 * MagneticButton
 * Interactive wrapper that attracts the button towards the cursor within its perimeter,
 * delivering an ultra-responsive, tactile physical feel.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  maxOffset = 12,
  as: Component = 'div',
  ...props
}) {
  const containerRef = useRef(null)
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    // Clamp displacement to prevent extreme movement
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX))
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY))

    setTransform(`translate3d(${clampedX}px, ${clampedY}px, 0px)`)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform('translate3d(0px, 0px, 0px)')
  }

  return (
    <Component
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-wrapper ${className}`.trim()}
      style={{
        transform,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1)'
          : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      {...props}
    >
      {children}
    </Component>
  )
}
