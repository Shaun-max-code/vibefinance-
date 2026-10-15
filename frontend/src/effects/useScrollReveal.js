import { useEffect, useRef, useState } from 'react'

/**
 * useScrollReveal
 * IntersectionObserver hook to detect when an element scrolls into view
 * and triggers smooth entrance animations.
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
  } = options

  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Fallback if IntersectionObserver is not available
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        if (triggerOnce) {
          observer.unobserve(el)
        }
      } else if (!triggerOnce) {
        setIsVisible(false)
      }
    }, {
      threshold,
      rootMargin,
    })

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return [ref, isVisible]
}
