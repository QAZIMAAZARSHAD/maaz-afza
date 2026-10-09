import { useEffect, useRef, useState } from 'react'
import './DetailsScreen.css'

const BG_SRC = '/images/page-06.webp'

const MAPS_URL =
  'https://maps.app.goo.gl/tR3ivTqmx3ykW8ACA'

const EVENTS = [
  {
    n: '1',
    y: '29.9%',
    title: 'Gathering',
    time: '5:00 PM',
    note: 'Guests are requested to arrive',
  },
  {
    n: '2',
    y: '40.72%',
    title: 'Manjha Ceremony',
    time: '6:00 PM',
    note: 'Music and family festivities',
  },
  {
    n: '3',
    y: '52.52%',
    title: 'Dinner',
    time: '7:30 PM',
    note: 'Join us for a delightful dinner',
  },
]

export default function DetailsScreen({ onContinue, onBack, active = true }) {
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
      className={`details${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="details__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="details__layer">
        <h1 className="details__heading">Manjha Details</h1>
        {EVENTS.map((event) => (
          <div className="details__event" key={event.n} style={{ '--y': event.y }}>
            <span className="details__num">{event.n}</span>
            <div className="details__copy">
              <p className="details__title">{event.title}</p>
              <p className="details__time">{event.time.replace(' ', '\u00a0')}</p>
              <p className="details__note">{event.note}</p>
            </div>
          </div>
        ))}

        <div className="details__venue">
          <p className="details__venue-label">Venue</p>
          <p className="details__residence">Our residence</p>
          <p className="details__address">
            126, Bandariya Bagh, Ghosiyana,
            <br />
            Deen Dayal Upadhyay Nagar, Bahraich
          </p>
        </div>

        <a className="details__directions" href={MAPS_URL} target="_blank" rel="noreferrer">
          <span>Directions</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h13M14 6.5 19.5 12 14 17.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <button className="details__scroll" type="button" onClick={handleContinue}>
        <span>Scroll</span>
        <i />
      </button>

      <div className="details__grain" />
    </section>
  )
}
