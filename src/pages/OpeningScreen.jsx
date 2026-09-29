import { useEffect, useRef, useState } from 'react'
import GoldDust from '../components/GoldDust.jsx'
import './OpeningScreen.css'

const BG_SRC = `/images/${encodeURIComponent('Page 1.png')}`

export default function OpeningScreen({ onEnter, active = true }) {
  const [ready, setReady] = useState(false)
  const lock = useRef(false)

  useEffect(() => {
    const img = new Image()
    img.src = BG_SRC
    const markReady = () => setReady(true)
    if (img.complete) markReady()
    else img.onload = markReady
  }, [])

  function handleEnter() {
    if (lock.current) return
    lock.current = true
    onEnter?.()
  }

  useEffect(() => {
    if (active) lock.current = false
  }, [active])

  return (
    <section className={`opening${ready ? ' is-ready' : ''}`}>
      <div className="opening__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />
      <div className="opening__wash" />
      <div className="opening__glow" />
      <GoldDust />
      <div className="opening__grain" />

      <h1 className="sr-only">Maaz and Afza — A New Chapter Begins</h1>

      <div className="opening__content">
        <div className="opening__footer">
          <button className="opening__cta" type="button" onClick={handleEnter}>
            <span>Enter the Celebration</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h12M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
