import { useEffect, useRef, useState } from 'react'
import './RsvpScreen.css'

const BG_SRC = '/images/page-15.webp'

const EVENTS = [
  { id: 'manjha', label: 'Manjha (27 Jan 2027)' },
  { id: 'baraat', label: 'Baraat (28 Jan 2027)' },
  { id: 'wedding', label: 'Wedding (28 Jan 2027)' },
  { id: 'reception', label: 'Reception (30 Jan 2027)' },
]

function Flourish() {
  return (
    <svg className="rsvp__flourish" viewBox="0 0 300 44" aria-hidden="true">
      <path className="rsvp__flourish-line" d="M4 22h112" />
      <path className="rsvp__flourish-line" d="M184 22h112" />
      <path className="rsvp__flourish-finial" d="m116 22 3.1-1.7 3.1 1.7-3.1 1.7z" />
      <path className="rsvp__flourish-finial" d="m184 22-3.1-1.7-3.1 1.7 3.1 1.7z" />
      <g className="rsvp__flourish-bloom" transform="translate(150 22)">
        <path d="M0-17.4C4.8-11.2 4.5-5.4 0-1.7-4.5-5.4-4.8-11.2 0-17.4z" />
        <path d="M0-17.4C4.8-11.2 4.5-5.4 0-1.7-4.5-5.4-4.8-11.2 0-17.4z" transform="rotate(90)" />
        <path d="M0-17.4C4.8-11.2 4.5-5.4 0-1.7-4.5-5.4-4.8-11.2 0-17.4z" transform="rotate(180)" />
        <path d="M0-17.4C4.8-11.2 4.5-5.4 0-1.7-4.5-5.4-4.8-11.2 0-17.4z" transform="rotate(270)" />
        <path d="M0-12.6C3-8.4 2.8-4.5 0-2-2.8-4.5-3-8.4 0-12.6z" transform="rotate(45)" />
        <path d="M0-12.6C3-8.4 2.8-4.5 0-2-2.8-4.5-3-8.4 0-12.6z" transform="rotate(135)" />
        <path d="M0-12.6C3-8.4 2.8-4.5 0-2-2.8-4.5-3-8.4 0-12.6z" transform="rotate(225)" />
        <path d="M0-12.6C3-8.4 2.8-4.5 0-2-2.8-4.5-3-8.4 0-12.6z" transform="rotate(315)" />
        <circle r="2.2" />
      </g>
    </svg>
  )
}

export default function RsvpScreen({ onContinue, onBack, eventIds, active = true }) {
  const choices = EVENTS.filter((item) => eventIds.includes(item.id))
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [name, setName] = useState('')
  const [events, setEvents] = useState([])
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const leavingRef = useRef(false)
  const sectionRef = useRef(null)
  const touchY = useRef(0)
  const touchInteractive = useRef(false)

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
      touchInteractive.current = Boolean(
        event.target.closest('input, textarea, button, label'),
      )
    }
    const onTouchEnd = (event) => {
      if (touchInteractive.current) return
      const dy = touchY.current - event.changedTouches[0].clientY
      if (dy > 36) handleContinue()
      else if (dy < -36) handleBack()
    }
    const onKey = (event) => {
      const tag = event.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'LABEL') return
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

  function toggleEvent(id) {
    setEvents((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please share your name.')
      return
    }
    if (choices.length > 1 && events.length === 0) {
      setError('Please choose the events you will attend.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <section
      ref={sectionRef}
      className={`rsvp${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="rsvp__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="rsvp__layer">
        {sent ? (
          <div className="rsvp__thanks">
            <Flourish />
            <h1>With gratitude</h1>
            <p>Your response is with us. We look forward to celebrating with you.</p>
            <Flourish />
          </div>
        ) : (
          <form className="rsvp__form" onSubmit={handleSubmit} noValidate>
            <Flourish />
            <h1 className="rsvp__title">Will you be joining us?</h1>
            <p className="rsvp__lead">
              We look forward to your presence
              <br />
              and blessings.
            </p>

            <label className="rsvp__field">
              <span>Your Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setError('')
                }}
              />
            </label>

            {choices.length > 1 && (
              <fieldset className="rsvp__events">
                <legend>Which events will you be attending?</legend>
                {choices.map((item) => (
                  <label className="rsvp__check" key={item.id}>
                    <input
                      type="checkbox"
                      name="events"
                      value={item.id}
                      checked={events.includes(item.id)}
                      onChange={() => toggleEvent(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </fieldset>
            )}

            <div className="rsvp__guests">
              <span id="rsvp-guests-label">Number of Guests</span>
              <div className="rsvp__stepper" role="group" aria-labelledby="rsvp-guests-label">
                <button
                  type="button"
                  aria-label="Fewer guests"
                  disabled={guests <= 1}
                  onClick={() => setGuests((count) => Math.max(1, count - 1))}
                >
                  −
                </button>
                <span aria-live="polite">{guests}</span>
                <button
                  type="button"
                  aria-label="More guests"
                  disabled={guests >= 10}
                  onClick={() => setGuests((count) => Math.min(10, count + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <label className="rsvp__field rsvp__field--note">
              <span>A message for us (optional)</span>
              <textarea
                name="message"
                rows={2}
                placeholder="Your wishes mean a lot..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            <p className="rsvp__error" role={error ? 'alert' : undefined}>{error}</p>

            <Flourish />

            <button className="rsvp__send" type="submit">
              <span>Send your response</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h12M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        )}
      </div>

      {sent && (
        <button className="rsvp__scroll" type="button" onClick={handleContinue}>
          <span>Scroll</span>
          <i />
        </button>
      )}

      <div className="rsvp__grain" />
    </section>
  )
}
