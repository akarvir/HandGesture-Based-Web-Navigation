import React, { useEffect, useRef, useState } from 'react'
import Overlay from './components/Overlay'
import Toast from './components/Toast'
import { HandTracker } from './hand/mediapipe'
import { handleGesture } from './actions'
import type { Gesture } from './gestures/types'

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [fps, setFps] = useState<number>(0)
  const [lastGesture, setLastGesture] = useState<string | null>(null)
  const [toast, setToast] = useState<string>('')
  const toastTimer = useRef<number | null>(null)

  useEffect(() => {
    (async () => {
      if (!videoRef.current || !canvasRef.current) return
      const tracker = new HandTracker({
        videoEl: videoRef.current,
        canvasEl: canvasRef.current,
        onFrame: ({ fps, gesture }) => {
          setFps(fps)
          setLastGesture(gesture.type)
          const { message } = handleGesture(gesture)
          if (message) showToast(message)
        }
      })
      await tracker.init()
      await tracker.startCamera()
      setCameraOn(true)
    })()

    return () => { /* camera stops on refresh; add tracker.stop() if you persist instance */ }
  }, [])

  function showToast(msg: string) {
    if (!msg) return
    setToast(msg)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 1300)
  }

  return (
    <div className="container">
      <header>
        <h1>Hands-Only Browser Control</h1>
        <span className="badge">MediaPipe Hands + React + Vite</span>
      </header>

      <main>
        <div className="card">
          <h2>Try the gestures</h2>
          <ul>
            <li><b>☝️ Index finger up</b>: scroll up continuously</li>
            <li><b>👇 Index finger down</b>: scroll down continuously</li>
            <li><b>✊ Closed fist</b>: stop scrolling</li>
          </ul>
        </div>

        {[...Array(6)].map((_, i) => (
          <article key={i} className="card">
            <h3>Demo Article #{i + 1}</h3>
            <p>
              This is a demo card to test gesture-based actions. Scroll with a swipe gesture,
              give a thumbs-up to toggle the like state on the visible card, and pinch to zoom the content.
              Hand tracking runs on-device in your browser via WebAssembly.
            </p>
            <div className="like-row">
              <button className="like" data-gesture-like>Like</button>
            </div>
          </article>
        ))}
      </main>

      <div className="video-wrap">
        <video ref={videoRef} muted playsInline></video>
        <canvas ref={canvasRef}></canvas>
      </div>

      <Overlay cameraOn={cameraOn} lastGesture={lastGesture} fps={fps} />
      <Toast message={toast} />
    </div>
  )
}