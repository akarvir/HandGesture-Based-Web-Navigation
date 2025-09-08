# Hands-Only Browser Control (React + Vite + MediaPipe)
Control the page using hand gestures detected with MediaPipe Tasks – HandLandmarker.

**Gestures implemented**
- 👍 Thumbs up → likes the first visible card
- 🤏 Pinch → zoom (0.6x–2.0x)
- 👋 Swipe up/down → scroll

## Quickstart
```bash
npm i    # or: pnpm i, yarn
npm run dev
```
Open the printed local URL and allow camera permissions (localhost is a secure context for webcams).

## Notes
- Model + WASM are fetched from CDN; you can self-host the files if needed.