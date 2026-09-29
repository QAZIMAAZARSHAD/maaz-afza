import { useEffect, useRef, useState } from 'react'
import './FamiliesScreen.css'

const BG_SRC = `/images/${encodeURIComponent('Page 14.png')}`

const NAMES = [
  'Khalid Islam',
  'Abdul Mubeen Khan',
  'Rashid Islam',
  'Mohd. Humayun Shakeel',
  'Ahmad Syedain',
  'Owais Khan',
  'Ali Ukkasha',
  'Ayan Sagheer',
  'Hammad Masood',
]

const GROUPS = [NAMES.slice(0, 3), NAMES.slice(3, 6), NAMES.slice(6, 9)]

export default function FamiliesScreen({ onContinue, onBack, active = true }) {
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
      className={`families${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`}
    >
      <div className="families__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />

      <div className="families__layer">
        <div className="families__names">
          {GROUPS.map((group) => (
            <ol className="families__group" key={group[0]}>
              {group.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ol>
          ))}
        </div>
      </div>

      <button className="families__scroll" type="button" onClick={handleContinue}>
        <span>Scroll</span>
        <i />
      </button>

      <div className="families__grain" />
    </section>
  )
}
