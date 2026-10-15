import { useState, useRef, useCallback } from 'react'

/**
 * useTilt3D
 * Advanced 3D depth and perspective tilt hook.
 * Calculates pointer position, dynamic lighting reflection (specular glare),
 * and reactive counter-directional shadows to make cards look physically raised off the surface.
 */
export function useTilt3D(options = {}) {
  const {
    maxTilt = 8,
    perspective = 1100,
    scale = 1.02,
    glare = false,
  } = options

  const ref = useRef(null)
  const [tiltState, setTiltState] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.55)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  })

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate normalized position between -1 and 1
    const normX = (x - centerX) / centerX
    const normY = (y - centerY) / centerY

    // Tilt angle (inverted Y for natural tilt towards mouse)
    const tiltX = -normY * maxTilt
    const tiltY = normX * maxTilt

    // Dynamic drop shadow shifting opposite to the tilt direction (overhead light illusion)
    const shadowOffsetX = (-tiltY * 3.5).toFixed(1)
    const shadowOffsetY = (tiltX * 3.5 + 18).toFixed(1)
    const shadowBlur = (28 + Math.abs(normX * 10) + Math.abs(normY * 10)).toFixed(1)

    setTiltState({
      transform: `perspective(${perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px -8px rgba(0, 0, 0, 0.75)`,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: true,
    })
  }, [maxTilt, perspective, scale])

  const handleMouseLeave = useCallback(() => {
    setTiltState({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.55)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false,
    })
  }, [perspective])

  return {
    ref,
    tiltState,
    eventHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  }
}
