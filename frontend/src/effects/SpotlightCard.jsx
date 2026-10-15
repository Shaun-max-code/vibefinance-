import React from 'react'

/**
 * SpotlightCard
 * Polished glassmorphism card container.
 * (Hovering glow effect of the cursor removed per user request)
 */
export default function SpotlightCard({
  children,
  className = '',
  as: Component = 'div',
  variant = 'green', // 'green' | 'blue' | 'purple' | 'amber'
  style = {},
  ...props
}) {
  const variantClass = variant !== 'green' ? `spotlight-${variant}` : ''

  return (
    <Component
      className={`spotlight-card ${variantClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}
