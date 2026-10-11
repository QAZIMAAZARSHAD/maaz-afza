import { useEffect, useRef, useState } from 'react'
import './ReceptionDetailsScreen.css'

import { asset } from '../data/artwork.js'

const BG_SRC = asset('/images/page-12.webp')

const MAPS_URL =
  'https://maps.app.goo.gl/eEh2PQmpxd7X28bNA'

export default function ReceptionDetailsScreen({ onContinue, onBack, active = true }) {
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)
  const sectionRef = useRef(null)
  const touchY = useRef(0)

  useEffect(() => {
    const img = new Image()
    img.src = BG_SRC
    const markReady = () => setReady(true)
    if (img.complete) markReady()
    else img.onload = markReady
  }, [])

  function leaveTo(next) {
    if (leavingRef.current) return
    leavingRef.current = true
    next?.()
  }

  useEffect(() => {
    if (active) leavingRef.current = false
  }, [active])

  function handleContinue() {
    leaveTo(onContinue)
  }

  function handleBack() {
    leaveTo(onBack)
  }

  useEffect(() => {
    if (!ready || !active) return undefined
    const node = sectionRef.current
    if (!node) return undefined

    const onWheel = (event) => {
      if (event.deltaY > 18) handleContinue()
      else if (event.deltaY < -18) handleBack()
    }
    const onTouchStart = (event) => {
      touchY.current = event.touches[0].clientY
    }
    const onTouchEnd = (event) => {
      const dy = touchY.current - event.changedTouches[0].clientY
      if (dy > 36) handleContinue()
      else if (dy < -36) handleBack()
    }
    const onKey = (event) => {
      if (event.target.closest('a') && event.key === 'Enter') return
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault()
        handleContinue()
      } else if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        handleBack()
      }
    }

    node.addEventListener('wheel', onWheel, { passive: true })
    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      node.removeEventListener('wheel', onWheel)
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [ready, active])

  return (
    <section
      ref={sectionRef}
      className={`feast${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="feast__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="feast__layer">
        <h1 className="feast__title">
          <span>Reception</span>
          <span>Details</span>
        </h1>

        <div className="feast__mark feast__mark--meal" aria-hidden="true">
          <svg viewBox="0 0 88 64">
            <path d="M8 50 A 36 36 0 0 1 80 50" fill="none" stroke="currentColor" strokeWidth="1.35" />
            <path
              d="M38 30.5v8.2c0 1.5-1.15 2.2-2.2 2.2h-.25V48M35.6 30.5v6M38 30.5v6M40.4 30.5v6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
            <path
              d="M48.2 31c2.2.9 3.4 2.8 3.4 5.4 0 2.3-1 3.9-3.4 4.4V48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="feast__meal">Dinner</p>
        <p className="feast__time">8:00{'\u00a0'}PM</p>

        <div className="feast__mark feast__mark--pin" aria-hidden="true">
          <svg viewBox="0 0 88 64">
            <path d="M8 50 A 36 36 0 0 1 80 50" fill="none" stroke="currentColor" strokeWidth="1.35" />
            <path
              d="M44 46.5s6.4-5.4 6.4-10a6.4 6.4 0 1 0-12.8 0c0 4.6 6.4 10 6.4 10z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <circle cx="44" cy="36.2" r="1.7" fill="currentColor" />
          </svg>
        </div>
        <p className="feast__venue-label">Venue</p>
        <p className="feast__hotel">Shagun Palace</p>
        <p className="feast__address">
          Lucknow Road, Near Banjari Mod,
          <br />
          Saryu Nagar, Bahraich - 271802
        </p>

        <a className="feast__directions" href={MAPS_URL} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" />
            <circle cx="12" cy="10.6" r="2.1" />
          </svg>
          Get directions
        </a>
      </div>

      <button className="feast__scroll" type="button" onClick={handleContinue}>
        <span>Scroll</span>
        <i />
      </button>

      <div className="feast__grain" />
    </section>
  )
}
