import { useEffect, useRef, useState } from 'react'
import GoldDust from '../components/GoldDust.jsx'
import './ClosingScreen.css'

const BG_SRC = '/images/page-16.webp'
const NAMES = 'Mr. & Mrs. Arshad Islam'

export default function ClosingScreen({ onBack, active = true }) {
  const [ready, setReady] = useState(false)
  const [typed, setTyped] = useState(0)
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
    if (!ready || !active) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(NAMES.length)
      return undefined
    }
    setTyped(0)
    let count = 0
    const timer = window.setInterval(() => {
      count += 1
      setTyped(count)
      if (count >= NAMES.length) window.clearInterval(timer)
    }, 78)
    return () => window.clearInterval(timer)
  }, [ready, active])

  function handleBack() {
    if (leavingRef.current) return
    leavingRef.current = true
    onBack?.()
  }

  useEffect(() => {
    if (active) leavingRef.current = false
  }, [active])

  useEffect(() => {
    if (!ready || !active) return undefined
    const node = sectionRef.current
    if (!node) return undefined

    const onWheel = (event) => {
      if (event.deltaY < -18) handleBack()
    }
    const onTouchStart = (event) => {
      touchY.current = event.touches[0].clientY
    }
    const onTouchEnd = (event) => {
      const dy = touchY.current - event.changedTouches[0].clientY
      if (dy < -36) handleBack()
    }
    const onKey = (event) => {
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
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
      className={`closing${ready ? ' is-ready' : ''}`}
    >
      <div className="closing__bg" style={{ backgroundImage: `url("${BG_SRC}")` }} />
      <GoldDust />

      <div className="closing__layer">
        <p className="closing__love">With love</p>
        <p className={`closing__names${typed >= NAMES.length ? ' is-typed' : ''}`}>
          <span className="closing__names-ghost" aria-hidden="true">{NAMES}</span>
          <span className="closing__names-live">{NAMES.slice(0, typed)}</span>
        </p>
      </div>

      <div className="closing__grain" />
    </section>
  )
}
