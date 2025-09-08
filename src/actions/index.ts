import type { Gesture } from '../gestures/types'

let scrollInterval: number | null = null
let currentScrollDirection: 'up' | 'down' | null = null

function startScroll(direction: 'up' | 'down') {
  // Only restart if direction changed or not currently scrolling
  if (currentScrollDirection === direction && scrollInterval) {
    return // Already scrolling in the right direction
  }
  
  stopScroll()
  currentScrollDirection = direction
  
  scrollInterval = window.setInterval(() => {
    const dy = direction === 'up' ? -25 : 25 // Smoother scrolling with smaller steps
    window.scrollBy({ top: dy, behavior: 'auto' }) // Use 'auto' instead of 'smooth' to avoid conflicts
  }, 30) // More frequent updates for smoother motion
}

function stopScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval)
    scrollInterval = null
  }
  currentScrollDirection = null
}

export type ActionResult = { message?: string }

export function handleGesture(g: Gesture): ActionResult {
  if (g.type === 'point_up') {
    startScroll('up')
    return { message: '↑ Scrolling up' }
  }

  if (g.type === 'point_down') {
    startScroll('down')
    return { message: '↓ Scrolling down' }
  }

  if (g.type === 'fist') {
    stopScroll()
    return { message: '✊ Stopped' }
  }

  if (g.type === 'none') {
    // If we were scrolling and now there's no gesture, surface a single stop message
    const wasScrolling = currentScrollDirection !== null
    stopScroll()
    return wasScrolling ? { message: '✊ Stopped' } : {}
  }

  return {}
}
