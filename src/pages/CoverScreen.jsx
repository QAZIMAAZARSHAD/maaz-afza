import { useEffect, useRef, useState } from 'react'
import GoldDust from '../components/GoldDust.jsx'
import './CoverScreen.css'

import { asset } from '../data/artwork.js'

const BG_SRC = asset('/images/page-02.webp')
const COUPLE_SRC = asset('/images/couple.webp')
/** Couple fade-in delay (1.65s) + duration (3.4s) from CoverScreen.css */
const COUPLE_READY_MS = 5050

export default function CoverScreen({ onOpen, onBack, active = true }) {
  const [ready, setReady] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
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

  useEffect(() => {
    if (!ready || !active) {
      setShowAdvance(false)
      return undefined
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setShowAdvance(true), reduced ? 0 : COUPLE_READY_MS)
    return () => window.clearTimeout(timer)
  }, [ready, active])

  function leaveTo(next) {
    if (leavingRef.current) return
    leavingRef.current = true
    next?.()
  }

  useEffect(() => {
    if (active) leavingRef.current = false
  }, [active])

  function handleOpen() {
    leaveTo(onOpen)
  }

  function handleBack() {
    leaveTo(onBack)
  }

  useEffect(() => {
    if (!ready || !active) return undefined
    const node = sectionRef.current
    if (!node) return undefined

    const onWheel = (event) => {
      if (event.deltaY > 18) handleOpen()
      else if (event.deltaY < -18) handleBack()
    }
    const onTouchStart = (event) => {
      touchY.current = event.touches[0].clientY
    }
    const onTouchEnd = (event) => {
      const dy = touchY.current - event.changedTouches[0].clientY
      if (dy > 36) handleOpen()
      else if (dy < -36) handleBack()
    }
    const onKey = (event) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault()
        handleOpen()
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
      className={`cover${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="cover__stage">
        <div className="cover__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

        <p className="cover__kicker">The wedding of</p>

        <div className="cover__names">
          <h1>
            <span className="cover__groom">Qazi Maaz Arshad</span>
            <span className="cover__amp" aria-hidden="true">&</span>
            <span className="cover__bride">Afza Aslam</span>
          </h1>
        </div>

        <div className="cover__wash" />
        <img className="cover__couple" src={COUPLE_SRC} alt="" />
      </div>

      {showAdvance && (
        <button className="cover__advance" type="button" onClick={handleOpen} aria-label="Next page">
          <i />
        </button>
      )}

      <div className="cover__glow cover__glow--left" />
      <div className="cover__glow cover__glow--right" />
      <GoldDust />
      <div className="cover__grain" />
    </section>
  )
}
