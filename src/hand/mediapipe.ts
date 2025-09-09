import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision'
import type { Gesture, Landmark } from '../gestures/types'
import { detectGesture } from '../gestures/detectors'
export type HandTrackerOptions = { onFrame: (args: { fps: number; gesture: Gesture; landmarks: Landmark[] | null }) => void; videoEl: HTMLVideoElement; canvasEl: HTMLCanvasElement }
export class HandTracker {
  private video: HTMLVideoElement; private canvas: HTMLCanvasElement; private ctx: CanvasRenderingContext2D
  private onFrame: HandTrackerOptions['onFrame']; private landmarker: HandLandmarker | null = null
  private drawingUtils: DrawingUtils | null = null; private animHandle: number | null = null; private lastT = 0
  constructor(opts: HandTrackerOptions) { this.video = opts.videoEl; this.canvas = opts.canvasEl; const ctx = this.canvas.getContext('2d'); if (!ctx) throw new Error('Canvas 2D context not available'); this.ctx = ctx; this.onFrame = opts.onFrame }
  async init() {
    const fileset = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.13/wasm')
    this.landmarker = await HandLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task' }, numHands: 1, runningMode: 'VIDEO' })
    this.drawingUtils = new DrawingUtils(this.ctx)
  }
  async startCamera() { 
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
    this.video.srcObject = stream
    await this.video.play()
    
    // Wait for video metadata to be loaded
    await new Promise<void>((resolve) => {
      const checkDimensions = () => {
        if (this.video.videoWidth > 0 && this.video.videoHeight > 0) {
          resolve()
        } else {
          setTimeout(checkDimensions, 100)
        }
      }
      checkDimensions()
    })
    
    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas())
    this.loop()
  }
  
  private resizeCanvas() { 
    const w = this.video.videoWidth || 640
    const h = this.video.videoHeight || 480
    console.log('Resizing canvas to:', w, 'x', h)
    this.canvas.width = w
    this.canvas.height = h
  }
  stop() { if (this.animHandle) cancelAnimationFrame(this.animHandle); const stream = this.video.srcObject as MediaStream | null; stream?.getTracks().forEach(t => t.stop()); this.video.srcObject = null }
  private loop = () => { this.animHandle = requestAnimationFrame(this.loop); this.processFrame() }
  private processFrame() {
    if (!this.landmarker) return
    
    // Safety check: ensure video has valid dimensions
    if (this.video.videoWidth <= 0 || this.video.videoHeight <= 0) {
      return
    }
    
    // Safety check: ensure canvas has valid dimensions
    if (this.canvas.width <= 0 || this.canvas.height <= 0) {
      this.resizeCanvas()
      return
    }
    
    const now = performance.now()
    const dt = this.lastT ? (now - this.lastT) / 1000 : 0
    this.lastT = now
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    try {
      const results = this.landmarker.detectForVideo(this.video, now)
      let gesture: Gesture = { type: 'none' }
      let lm: any = null
      
      if (results && results.landmarks && results.landmarks[0]) { // landmarks[0] represents landmarks for the first detected hand. 
        lm = results.landmarks[0].map((p: any) => ({ x: p.x, y: p.y, z: p.z }))
        gesture = detectGesture(lm)
        if (this.drawingUtils && results) {
          this.drawingUtils.drawConnectors(results.landmarks[0], HandLandmarker.HAND_CONNECTIONS, { color: '#10b981', lineWidth: 2 })
          this.drawingUtils.drawLandmarks(results.landmarks[0], { color: '#22d3ee', lineWidth: 1, radius: 2 })
        }
      }
      
      const fps = dt > 0 ? (1.0 / dt) : 0
      this.onFrame({ fps, gesture, landmarks: lm })
    } catch (error) {
      console.error('MediaPipe processing error:', error)
      // Continue the loop even if this frame fails
    }
  }
}


