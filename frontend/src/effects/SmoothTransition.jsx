import React, { useEffect, useState } from 'react'

/**
 * SmoothTransition
 * Wrapper component that animates new content smoothly in when the `viewKey` changes.
 * Current content fades out/in seamlessly with subtle slide.
 */
export default function SmoothTransition({
  children,
  viewKey,
  className = '',
  style = {},
}) {
  const [currentKey, setCurrentKey] = useState(viewKey)
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    if (viewKey !== currentKey) {
      setCurrentKey(viewKey)
      setAnimating(true)
      const timer = setTimeout(() => {
        setAnimating(false)
      }, 380)
      return () => clearTimeout(timer)
    }
  }, [viewKey, currentKey])

  return (
    <div
      key={currentKey}
      className={`page-transition-container ${animating ? 'page-transition-active' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
