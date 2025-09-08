import type { Gesture, Landmark } from './types'
import { bboxSize } from './utils'

export function detectGesture(landmarks: Landmark[]): Gesture {
  if (!landmarks || landmarks.length < 21) return { type: 'none' }

  const wrist = landmarks[0]
  // Thumb landmarks
  const thMCP = landmarks[2]
  const thIP = landmarks[3]
  const thTip = landmarks[4]
  const idxTip = landmarks[8]
  const idxMCP = landmarks[5]  // Metacarpophalangeal joint (base of index finger)
  const idxPIP = landmarks[6]  // Proximal interphalangeal joint
  const midTip = landmarks[12]
  const midMCP = landmarks[9]
  const ringTip = landmarks[16]
  const ringMCP = landmarks[13]
  const pinkyTip = landmarks[20]
  const pinkyMCP = landmarks[17]

  // Check if other fingers are curled (tips below their MCPs)
  const middleCurled = midTip.y > midMCP.y
  const ringCurled = ringTip.y > ringMCP.y
  const pinkyCurled = pinkyTip.y > pinkyMCP.y
  const othersCurled = middleCurled && ringCurled && pinkyCurled

  // --- Fist helpers (computed now, decided later) ---
  // For a fist, all fingertips close to wrist and curled below MCPs
  const tips = [idxTip, midTip, ringTip, pinkyTip]
  const avgDistToWrist = tips.reduce((sum, tip) => sum + Math.hypot(tip.x - wrist.x, tip.y - wrist.y), 0) / tips.length
  const indexCurled = idxTip.y > idxMCP.y
  const allFingersCurled = indexCurled && middleCurled && ringCurled && pinkyCurled

  // --- Index pointing up ---
  // MediaPipe Y increases downward → smaller y means "up"
  const indexExtendedUp = idxTip.y < idxPIP.y && idxPIP.y < idxMCP.y
  const indexPointingUp = indexExtendedUp && idxTip.y < idxMCP.y - 0.08
  if (indexPointingUp && othersCurled) {
    return { type: 'point_up' }
  }

  // --- Thumbs down (scroll down) ---
  // Thumb extended downward: tip > IP > MCP (y increases downward)
  const thumbExtendedDown = (thTip.y > thIP.y + 0.02) && (thIP.y > thMCP.y + 0.01)
  // Other fingers curled (including index)
  const indexCurledForThumbs = idxTip.y > idxMCP.y
  const thumbsDown = thumbExtendedDown && indexCurledForThumbs && othersCurled
  
  const indexPointingDown = thumbsDown
  
  if (indexPointingDown) {
    return { type: 'point_down' }
  }

  // --- Closed fist (neutral) ---
  // Decide fist last so pointing gestures win; normalize by hand size
  const size = bboxSize(landmarks)
  const norm = Math.max(size.w, size.h) + 1e-6
  const avgDistNorm = avgDistToWrist / norm
  if (allFingersCurled && avgDistNorm < 0.35) {
    return { type: 'fist' }
  }

  return { type: 'none' }
}
