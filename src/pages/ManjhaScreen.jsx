import { useEffect, useRef, useState } from 'react'
import GoldDust from '../components/GoldDust.jsx'
import './ManjhaScreen.css'

const BG_SRC = `/images/${encodeURIComponent('Page 4 V1.png')}`

function Crest() {
  return (
    <svg className="manjha__crest" viewBox="0 0 88 56" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round">
        <path d="M44 4c2.2 6.2 6.4 10.2 12.2 12.2C50.4 18.2 46.2 22.2 44 28c-2.2-5.8-6.4-9.8-12.2-11.8C37.6 14.2 41.8 10.2 44 4z" />
        <path d="M44 28c2.2 6.2 6.4 10.2 12.2 12.2C50.4 42.2 46.2 46.2 44 52c-2.2-5.8-6.4-9.8-12.2-11.8C37.6 38.2 41.8 34.2 44 28z" />
        <path d="M16 28c6.2-2.2 10.2-6.4 12.2-12.2C30.2 21.6 34.2 25.8 40 28c-5.8 2.2-9.8 6.4-11.8 12.2C26.2 34.4 22.2 30.2 16 28z" />
        <path d="M72 28c-6.2-2.2-10.2-6.4-12.2-12.2C57.8 21.6 53.8 25.8 48 28c5.8 2.2 9.8 6.4 11.8 12.2C61.8 34.4 65.8 30.2 72 28z" />
        <path d="M44 22.5l1.6 4.2 4.4.4-3.4 2.9 1.1 4.3L44 31.8l-3.7 2.5 1.1-4.3-3.4-2.9 4.4-.4z" />
      </g>
    </svg>
  )
}

function Rule({ place }) {
  return (
    <div className={`manjha__rule manjha__rule--${place}`} aria-hidden="true">
      <i />
      <svg viewBox="0 0 22 22">
        <path
          fill="currentColor"
          d="M11 1.2 13.1 8.2 20.6 11 13.1 13.8 11 20.8 8.9 13.8 1.4 11 8.9 8.2z"
        />
        <path
          fill="#e7d7a4"
          d="M11 8.2 12.1 10.2 14.2 11 12.1 11.8 11 13.8 9.9 11.8 7.8 11 9.9 10.2z"
        />
      </svg>
      <i />
    </div>
  )
}

function Knot({ place }) {
  return (
    <svg className={`manjha__knot manjha__knot--${place}`} viewBox="0 0 22 22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11 1.2 13.1 8.2 20.6 11 13.1 13.8 11 20.8 8.9 13.8 1.4 11 8.9 8.2z"
      />
      <path
        fill="#e7d7a4"
        d="M11 8.2 12.1 10.2 14.2 11 12.1 11.8 11 13.8 9.9 11.8 7.8 11 9.9 10.2z"
      />
    </svg>
  )
}

export default function ManjhaScreen({ onContinue, onBack, chapter = 'Chapter I', active = true }) {
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
      className={`manjha${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="manjha__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />
      <GoldDust />

      <div className="manjha__layer">
        <Crest />
        <Rule place="above" />
        <p className="manjha__chapter">{chapter}</p>
        <Rule place="below" />
        <h1 className="manjha__title">Manjha</h1>
        <Rule place="title" />
        <p className="manjha__date">27 Jan 2027</p>

        <button className="manjha__next" type="button" onClick={handleContinue} aria-label="Continue">
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

        <Knot place="above" />
        <p className="manjha__footer">
          Traditions bring
          <br />
          us closer
        </p>
        <Knot place="below" />
      </div>

      <div className="manjha__grain" />
    </section>
  )
}
