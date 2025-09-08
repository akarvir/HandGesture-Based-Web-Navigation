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
        <h1>Hands-Based Browser Navigation</h1>
        <span className="badge"></span>
      </header>

      <main>
        <article className="card">
          <h2>Horses: Companion, Athlete, and Icon</h2>
          <p>
            Horses have walked alongside humans for millennia as companions, workers, and athletes. Their
            partnership with people reshaped agriculture, transportation, warfare, and sport. From the
            windswept steppes where early domestication likely began to modern cities where mounted patrols
            still serve, the horse has remained a remarkably adaptable animal. Their speed, stamina, and
            social intelligence made them indispensable long before the internal combustion engine existed,
            and their cultural impact persists in language, art, and ritual across continents.
          </p>
          <p>
            Biomechanically, horses are built for efficient motion. A large thoracic cavity houses powerful
            lungs and a heart capable of sustaining prolonged exertion. Long limbs with spring-like tendons
            store and release elastic energy; a finely tuned hoof acts both as shock absorber and traction
            device. Their gaits—walk, trot, canter, and gallop—are not just speeds but distinct patterns of
            footfalls, each with its own rhythm, energy cost, and balance demands. Skilled riders feel these
            rhythms through the saddle and adjust their aids—weight, leg, and rein—to communicate with subtle
            clarity.
          </p>
          <p>
            Communication with a horse relies on pressure-and-release, timing, and consistency. Horses learn
            by seeking comfort: when they try a correct response and the rider releases pressure promptly,
            the behavior is reinforced. Body language matters as much as equipment; a square halt, a soft
            eye, or a swishing tail all convey information about comfort and understanding. Good training
            builds confidence in small increments, setting the horse up to answer yes to each new question
            before increasing difficulty. Poor timing, mixed signals, or pushing past fatigue can erode trust
            quickly.
          </p>
          <p>
            Nutrition and hoof care underpin soundness. Forage—grass and hay—should be the diet’s foundation,
            with concentrates added to meet energy needs without overwhelming the hindgut. Regular dental
            care ensures efficient chewing and weight maintenance. Hooves, often called “no hoof, no horse,”
            require routine trimming to maintain balance; shoes may be added for protection, traction, or
            therapeutic support. Subtle imbalances can cascade into joint strain or soft-tissue injury,
            reminding caretakers that prevention is both humane and economical.
          </p>
          <p>
            Disciplines showcase the horse’s versatility. In dressage, precision and suppleness emerge from
            gymnastic training that culminates in collected movements like piaffe and passage. Eventing tests
            bravery and fitness over varied terrain. Show jumping highlights power and adjustability between
            obstacles. Western disciplines such as reining and cutting celebrate agility and cow sense.
            Endurance competitors manage pacing and hydration over many miles, while driving pairs and teams
            demand coordination and calm. Across these sports, welfare-centered practices—adequate turnout,
            progressive conditioning, and rest—support longevity and joy in work.
          </p>
          <p>
            Equine behavior reflects a prey animal’s worldview. Horses value safety in numbers, clear
            boundaries, and predictable leadership. Startle responses are not disobedience but survival tools;
            desensitization and exposure, introduced patiently, transform fear into curiosity. Many training
            challenges are solved on the ground—leading, yielding shoulders and hindquarters, and standing
            quietly—before they are attempted under saddle.
          </p>
          <p>
            Modern technology complements horsemanship. Wearable sensors track stride length, symmetry, and
            heart rate to catch soreness early. High-speed video reveals subtle changes in gait timing.
            Nutrition tools estimate forage quality and balance mineral intake. Yet even with data-rich
            insights, the daily arts of grooming, observation, and quiet time in the paddock remain
            irreplaceable. Many problems resolve when horses have friends, forage, and freedom to move.
          </p>
          <p>
            The horse’s enduring appeal lies in partnership. A relaxed canter on a loose rein, ears flicking
            back to the rider; a steady trail mount crossing water with confidence; a retired schoolmaster
            teaching a beginner to post the trot—these small triumphs stitch humans and horses together.
            Long after horsepower ceased to measure engines, it continues to measure heart.
          </p>
          <h3>Conformation and Soundness</h3>
          <p>
            Conformation evaluates how a horse is put together: shoulder angle, pastern length, hoof-pastern
            axis, topline, and hindquarter structure. While no horse is perfect, functional balance distributes
            forces safely. Upright pasterns may increase concussion; long, sloping pasterns can stress soft
            tissues. Cow hocks or sickle hocks affect propulsion and joint loading. Observing a horse from the
            front, side, and rear—at rest and in motion—reveals patterns that inform hoof trimming, conditioning,
            and discipline suitability.
          </p>
          <h3>Saddle Fit and Comfort</h3>
          <p>
            A well-fit saddle clears the withers, distributes pressure along the panels, and remains stable in
            motion. Bridging (contact only at front and back) and rocking (contact only in the middle) create
            hot spots. Girth position, pad thickness, and tree width all interact with the horse’s back shape
            and the rider’s posture. Behavioral clues—tail swishing, pinning ears, hollowing the back—often
            precede visible rubs or white hairs.
          </p>
          <h3>First Aid Basics</h3>
          <p>
            Every barn should keep a stocked kit: digital thermometer, antiseptic scrub, bandage materials,
            standing wraps, stethoscope, and emergency contact numbers. Know baseline vitals (temperature,
            pulse, respiration) and practice safe bandaging. Call a veterinarian promptly for deep wounds,
            lameness, colic signs (rolling, looking at the flank), or sudden behavior changes.
          </p>
          <h3>Trailer Loading and Travel</h3>
          <p>
            Trailer loading builds on groundwork: leading confidently, yielding to light pressure, and standing
            quietly. Break the task into small steps with frequent releases. During travel, ensure adequate
            ventilation, secure footing, and regular rest stops for hydration and balance.
          </p>
          <h3>Seasonal Management</h3>
          <p>
            In hot weather, prioritize shade, electrolytes, and gradual conditioning. In winter, maintain
            hydration with unfrozen water and consider adding forage for warmth via fermentation. Parasite
            control should follow fecal egg count testing rather than fixed schedules to limit resistance.
          </p>
        </article>
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