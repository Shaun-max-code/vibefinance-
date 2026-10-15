import { useCallback } from 'react'

/**
 * useCardSpotlight
 * (Hovering glow effect of the cursor removed per user request)
 */
export function useCardSpotlight() {
  const handleMouseMove = useCallback(() => {}, [])
  return { onMouseMove: handleMouseMove }
}

