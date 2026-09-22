import { useEffect, useRef, useState } from 'react'
import './CeremonyScreen.css'

const BG_SRC = `/images/${encodeURIComponent('Page 5 V1.png')}`

function Rule({ place }) {
  return (
    <div className={`ceremony__rule ceremony__rule--${place}`} aria-hidden="true">
      <i />
      <svg viewBox="0 0 22 22">
        <path fill="currentColor" d="M11 1.2 13.1 8.2 20.6 11 13.1 13.8 11 20.8 8.9 13.8 1.4 11 8.9 8.2z" />
        <path fill="#e7d7a4" d="M11 8.2 12.1 10.2 14.2 11 12.1 11.8 11 13.8 9.9 11.8 7.8 11 9.9 10.2z" />
      </svg>
      <i />
    </div>
  )
}

export default function CeremonyScreen({ onContinue, onBack }) {
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
      className={`ceremony${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="ceremony__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="ceremony__layer">
        <p className="ceremony__kicker">You are warmly invited to the</p>
        <h1 className="ceremony__title">Manjha Ceremony</h1>
        <p className="ceremony__of">of</p>
        <p className="ceremony__name">Qazi Maaz Arshad</p>
        <Rule place="mid" />
        <p className="ceremony__body">
          A celebration of love, traditions
          <br />
          and new beginnings
        </p>
        <Rule place="date" />
        <p className="ceremony__when">
          <span className="ceremony__day">Tuesday</span>
          <span className="ceremony__date">27 Jan 2027</span>
        </p>

      </div>

      <button className="ceremony__scroll" type="button" onClick={handleContinue}>
        <span>Scroll</span>
        <i />
      </button>

      <div className="ceremony__grain" />
    </section>
  )
}
