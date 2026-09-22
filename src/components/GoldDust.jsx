import { useEffect, useRef } from 'react'

export default function GoldDust() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    let frame
    const particles = Array.from({ length: 52 }, () => spawn())

    function spawn() {
      return {
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.35 + 0.25,
        speed: Math.random() * 0.00018 + 0.00006,
        drift: Math.random() * 2 * Math.PI,
        twinkle: Math.random() * 2 * Math.PI,
        alpha: Math.random() * 0.45 + 0.12,
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function tick(time) {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      particles.forEach((p) => {
        p.y -= p.speed * 16
        p.x += Math.sin(time * 0.00035 + p.drift) * 0.00022
        if (p.y < -0.03) {
          p.y = 1.03
          p.x = Math.random()
        }
        const pulse = 0.55 + 0.45 * Math.sin(time * 0.002 + p.twinkle)
        ctx.beginPath()
        ctx.fillStyle = `rgba(240, 220, 160, ${p.alpha * pulse})`
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      frame = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="gold-dust" aria-hidden="true" />
}
