import React from 'react'
import { useTilt3D } from './useTilt3D'

/**
 * Tilt3DCard
 * Physically raised 3D perspective card.
 * - Tilts smoothly based on cursor coordinates.
 * - Specular glare reflection moves dynamically across the surface.
 * - Reactive counter-directional shadow deepens and shifts.
 * - Preserves 3D depth for nested children (.depth-layer-1, .depth-layer-2).
 */
export default function Tilt3DCard({
  children,
  className = '',
  maxTilt = 7,
  scale = 1.018,
  glare = true,
  as: Component = 'div',
  style = {},
  variant = 'green', // 'green' | 'blue' | 'purple' | 'amber'
  ...props
}) {
  const { ref, tiltState, eventHandlers } = useTilt3D({ maxTilt, scale, glare })

  const glareColor =
    variant === 'blue'
      ? 'rgba(56, 189, 248, 0.16)'
      : variant === 'purple'
      ? 'rgba(167, 139, 250, 0.16)'
      : variant === 'amber'
      ? 'rgba(251, 191, 36, 0.16)'
      : 'rgba(52, 211, 153, 0.16)'

  return (
    <Component
      ref={ref}
      {...eventHandlers}
      className={`tilt-3d-card ${className}`.trim()}
      style={{
        ...style,
        transform: tiltState.transform,
        boxShadow: tiltState.boxShadow,
        transformStyle: 'preserve-3d',
        transition: tiltState.isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.08s ease-out'
          : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s ease',
      }}
      {...props}
    >
      {/* Dynamic Specular Lighting Glare */}
      {glare && (
        <div
          className="tilt-3d-glare"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(420px circle at ${tiltState.glareX}% ${tiltState.glareY}%, ${glareColor}, rgba(255, 255, 255, 0.08) 20%, transparent 65%)`,
            opacity: tiltState.glareOpacity,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content with 3D Depth support */}
      <div style={{ position: 'relative', zIndex: 2, transformStyle: 'preserve-3d', height: '100%' }}>
        {children}
      </div>
    </Component>
  )
}
