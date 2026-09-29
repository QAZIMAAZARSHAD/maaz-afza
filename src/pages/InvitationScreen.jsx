import { useEffect, useRef, useState } from 'react'
import GoldDust from '../components/GoldDust.jsx'
import { INVITE_VERSIONS } from '../data/invitationVersions.js'
import './InvitationScreen.css'

export default function InvitationScreen({ onContinue, onBack, versionId, active = true }) {
  const version =
    INVITE_VERSIONS.find((item) => item.id === versionId) ?? INVITE_VERSIONS[0]

  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)
  const sectionRef = useRef(null)
  const touchY = useRef(0)

  useEffect(() => {
    INVITE_VERSIONS.forEach((item) => {
      const preload = new Image()
      preload.src = item.bg
    })
  }, [])

  useEffect(() => {
    const img = new Image()
    img.src = version.bg
    const markReady = () => setReady(true)
    if (img.complete) markReady()
    else img.onload = markReady
  }, [version.bg])

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
      className={`invite${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
      data-layout={version.layout}
      data-id={version.id}
    >
      <div className="invite__stage">
        <div className="invite__bg" style={{ backgroundImage: `url("${version.bg}")` }} />

        <div key={version.id} className="invite__copy">
          <div className="invite__intro">
            <header className="invite__host">
              <p className="invite__host-name">Mrs. Rafiyah Nikhat</p>
              <p className="invite__host-sub">W/O Late Qazi Islam Ullah</p>
            </header>
            <p className="invite__lead">{version.invite}</p>
          </div>

          <div className="invite__couple">
            <p className="invite__groom">Qazi Maaz Arshad</p>
            <p className="invite__parents">S/O Arshad Islam and Bushra Abbasi</p>
            <p className="invite__with">with</p>
            <p className="invite__bride">Afza Aslam</p>
            <p className="invite__parents">D/O Mohd Aslam and Shaheen Akhtar</p>
          </div>

          {version.notePosition === 'above' && (
            <p className="invite__note">{version.note}</p>
          )}
        </div>

        {version.notePosition === 'mid' && (
          <p key={`${version.id}-note`} className="invite__note invite__note--mid">
            {version.note}
          </p>
        )}

        <div key={`${version.id}-events`} className="invite__events">
            {version.events.map((event) => (
              <div
                className="invite__event"
                key={`${event.name}-${event.date}`}
                style={{ '--x': event.x }}
              >
                <span className="invite__event-name">{event.name}</span>
                <span className="invite__event-date">{event.date}</span>
              </div>
            ))}
        </div>

        {(version.footer || version.notePosition === 'below') && (
          <div key={`${version.id}-closing`} className="invite__closing">
            {version.footer && <p className="invite__footer">{version.footer}</p>}
            {version.notePosition === 'below' && (
              <p className="invite__note invite__note--below">{version.note}</p>
            )}
          </div>
        )}
      </div>

      <GoldDust />
      <div className="invite__grain" />

      <button className="invite__scroll" type="button" onClick={handleContinue}>
        <span>Scroll</span>
        <i />
      </button>
    </section>
  )
}
