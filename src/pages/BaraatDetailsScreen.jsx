import { useEffect, useRef, useState } from 'react'
import './BaraatDetailsScreen.css'

const BG_SRC = '/images/page-09.webp'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=The%20Royal%20Orchid%20Banquet%2C%20NH%2027%2C%20Unnao%20Lucknow%20Road%2C%20Unnao%2C%20Uttar%20Pradesh%20209801'

const EVENTS = [
  {
    y: '22.65%',
    label: 'Gather at residence',
    time: '11:00 AM',
    note: '126, Bandariya Bagh, Ghosiyana,\nDeen Dayal Upadhyay Nagar, Bahraich',
  },
  {
    y: '33%',
    label: 'Baraat departure',
    time: '12:00 PM',
  },
  {
    y: '40.71%',
    label: 'Journey',
    detail: 'From Bahraich to Unnao',
  },
  {
    y: '48.79%',
    label: 'Baraat arrival',
    time: '4:00 PM',
  },
  {
    y: '56.03%',
    label: 'Nikah',
    time: '5:30 PM',
  },
  {
    y: '63.14%',
    label: 'Dinner',
    time: '7:00 PM',
  },
  {
    y: '70.2%',
    label: 'Baraat return',
    time: '9:00 PM',
  },
]

export default function BaraatDetailsScreen({ onContinue, onBack, active = true }) {
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
      className={`schedule${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="schedule__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="schedule__layer">
        <h1 className="schedule__heading">Baraat Details</h1>
        <div className="schedule__rule" aria-hidden="true"><i /><b /><i /></div>
        <p className="schedule__date">28 January 2027</p>

        {EVENTS.map((event) => (
          <div className="schedule__event" key={event.label} style={{ '--y': event.y }}>
            <p className="schedule__label">{event.label}</p>
            {event.time && <p className="schedule__time">{event.time.replace(' ', '\u00a0')}</p>}
            {event.detail && <p className="schedule__detail">{event.detail}</p>}
            {event.note && <p className="schedule__note">{event.note}</p>}
          </div>
        ))}

        <div className="schedule__venue">
          <p className="schedule__venue-label">Venue</p>
          <p className="schedule__venue-name">TBD</p>
          <p className="schedule__venue-address">
            Unnao, Uttar Pradesh – 209801
          </p>
        </div>

        <a className="schedule__directions" href={MAPS_URL} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" />
            <circle cx="12" cy="10.6" r="2.1" />
          </svg>
          Get directions
        </a>
      </div>

      <button className="schedule__advance" type="button" onClick={handleContinue} aria-label="Next page">
        <i />
      </button>

      <div className="schedule__grain" />
    </section>
  )
}
