import { useCallback } from 'react'

/**
 * useCardSpotlight
 * Mouse event handler that calculates cursor position relative to the element
 * and updates CSS variables `--mouse-x` and `--mouse-y` for radiant spotlight glow.
 */
export function useCardSpotlight() {
  const handleMouseMove = useCallback((e) => {
    const target = e.currentTarget
    if (!target) return
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    target.style.setProperty('--mouse-x', `${x}px`)
    target.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  return { onMouseMove: handleMouseMove }
}
