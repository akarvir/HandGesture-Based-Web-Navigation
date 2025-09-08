import React from 'react'
type Props = { cameraOn: boolean; lastGesture: string | null; fps?: number }
export default function Overlay({ cameraOn, lastGesture, fps }: Props) {
  return (
    <div className="hud">
      <div className="row"><div className={`dot ${cameraOn ? 'on' : ''}`} /> Camera</div>
      <div className="row">Gesture: <b>{lastGesture ?? '—'}</b></div>
      {typeof fps === 'number' && <div className="row">FPS: {fps.toFixed(0)}</div>}
      <div style={{fontSize:12, opacity:0.8}}>Try 👍 thumbs-up (like), pinch (zoom), swipe up/down (scroll)</div>
    </div>
  )
}