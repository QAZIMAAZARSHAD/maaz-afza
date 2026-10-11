import { useEffect, useRef, useState } from 'react'
import './EveningScreen.css'

import { asset } from '../data/artwork.js'

const BG_SRC = asset('/images/page-11.webp')

export default function EveningScreen({ onContinue, onBack, active = true }) {
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
      className={`evening${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="evening__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="evening__layer">
        <p className="evening__kicker">You are warmly invited to the</p>
        <h1 className="evening__title">Wedding Reception</h1>
        <p className="evening__script">of</p>
        <p className="evening__name">Qazi Maaz Arshad</p>
        <p className="evening__script evening__script--amp">&amp;</p>
        <p className="evening__name evening__name--bride">Afza Aslam</p>
        <p className="evening__day">Saturday</p>
        <p className="evening__date">30 January 2027</p>
      </div>

      <button className="evening__scroll" type="button" onClick={handleContinue}>
        <span>Scroll</span>
        <i />
      </button>

      <div className="evening__grain" />
    </section>
  )
}
