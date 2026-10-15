import React from 'react'
import { useScrollReveal } from './useScrollReveal'

/**
 * ScrollReveal
 * Wrapper component that animates its children into view when scrolled to.
 * Supports direction ('up', 'left', 'right'), delay, and custom class names.
 */
export default function ScrollReveal({
  children,
  as: Component = 'div',
  direction = 'up', // 'up' | 'left' | 'right'
  delay = 0, // 0 | 1 | 2 | 3 | 4 | 5
  className = '',
  style = {},
  threshold = 0.12,
  ...props
}) {
  const [ref, isVisible] = useScrollReveal({ threshold })

  let dirClass = 'scroll-reveal'
  if (direction === 'left') dirClass = 'scroll-reveal-left'
  if (direction === 'right') dirClass = 'scroll-reveal-right'

  const delayClass = delay > 0 ? `delay-${delay}` : ''
  const visibleClass = isVisible ? 'reveal-visible' : ''

  return (
    <Component
      ref={ref}
      className={`${dirClass} ${delayClass} ${visibleClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}
