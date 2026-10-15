import React, { useRef } from 'react'

/**
 * SpotlightCard
 * Card component with reactive magnetic spotlight surface and glowing border
 * that tracks the mouse cursor in real-time.
 */
export default function SpotlightCard({
  children,
  className = '',
  as: Component = 'div',
  variant = 'green', // 'green' | 'blue' | 'purple' | 'amber'
  style = {},
  ...props
}) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const variantClass = variant !== 'green' ? `spotlight-${variant}` : ''

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${variantClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}
