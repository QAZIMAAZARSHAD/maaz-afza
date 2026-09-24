import { useEffect, useRef, useState } from 'react'
import './WeddingScreen.css'

const BG_SRC = `/images/${encodeURIComponent('Page 7 V1.png')}`

export default function WeddingScreen({ onContinue, onBack }) {
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
    setLeaving(true)
    window.setTimeout(() => next?.(), 1100)
  }

  function handleContinue() {
    leaveTo(onContinue)
  }

  function handleBack() {
    leaveTo(onBack)
  }

  useEffect(() => {
    if (!ready) return undefined
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
  }, [ready])

  return (
    <section
      ref={sectionRef}
      className={`wedding${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="wedding__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="wedding__layer">
        <p className="wedding__chapter">Chapter II</p>
        <h1 className="wedding__title">
          <span>Jashn-E</span>
          <span>Nikah</span>
        </h1>
        <p className="wedding__kicker">The wedding</p>
        <p className="wedding__date">28 Jan 2027</p>

        <button className="wedding__next" type="button" onClick={handleContinue} aria-label="Continue">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h12M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="wedding__sign">
          Love leads
          <br />
          us forward
        </p>
      </div>

      <div className="wedding__grain" />
    </section>
  )
}
