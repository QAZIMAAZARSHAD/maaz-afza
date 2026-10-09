import { useEffect, useRef, useState } from 'react'
import OpeningScreen from './pages/OpeningScreen.jsx'
import CoverScreen from './pages/CoverScreen.jsx'
import InvitationScreen from './pages/InvitationScreen.jsx'
import ManjhaScreen from './pages/ManjhaScreen.jsx'
import CeremonyScreen from './pages/CeremonyScreen.jsx'
import DetailsScreen from './pages/DetailsScreen.jsx'
import WeddingScreen from './pages/WeddingScreen.jsx'
import BaraatScreen from './pages/BaraatScreen.jsx'
import BaraatDetailsScreen from './pages/BaraatDetailsScreen.jsx'
import ReceptionScreen from './pages/ReceptionScreen.jsx'
import EveningScreen from './pages/EveningScreen.jsx'
import ReceptionDetailsScreen from './pages/ReceptionDetailsScreen.jsx'
import FamiliesScreen from './pages/FamiliesScreen.jsx'
import RsvpScreen from './pages/RsvpScreen.jsx'
import ClosingScreen from './pages/ClosingScreen.jsx'
import { journeyFromPath } from './data/journeys.js'
import { ARTWORK, imagesForPage, preloadImages } from './data/artwork.js'
import './motion.css'

export default function App() {
  const journey = journeyFromPath()
  const [page, setPage] = useState(journey.pages[0])
  const [outgoing, setOutgoing] = useState(null)
  const fadeTimer = useRef(0)
  const musicRef = useRef(null)

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  useEffect(() => {
    const index = journey.pages.indexOf(page)
    const ids = [page, journey.pages[index + 1]].filter(Boolean)
    const urls = ids.flatMap((id) => imagesForPage(id, journey.id))
    preloadImages(page === 'cover' ? urls : urls.filter((url) => url !== ARTWORK.couple))
  }, [page, journey])

  function beginCelebration() {
    const music = musicRef.current
    if (!music) return
    music.loop = true
    music.play().catch(() => {})
  }

  function go(id, delta) {
    const index = journey.pages.indexOf(id)
    const next = journey.pages[index + delta]
    if (!next || next === page) return
    setOutgoing(id)
    setPage(next)
    window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => setOutgoing(null), 1300)
  }

  function renderPage(id, active) {
    if (id === 'opening') {
      return (
        <OpeningScreen
          active={active}
          onEnter={() => {
            beginCelebration()
            go('opening', 1)
          }}
        />
      )
    }
    if (id === 'cover') {
      return (
        <CoverScreen
          active={active}
          onOpen={() => go('cover', 1)}
          onBack={() => go('cover', -1)}
        />
      )
    }
    if (id === 'invitation') {
      return (
        <InvitationScreen
          active={active}
          versionId={journey.id}
          onContinue={() => go('invitation', 1)}
          onBack={() => go('invitation', -1)}
        />
      )
    }
    if (id === 'manjha') {
      return (
        <ManjhaScreen
          active={active}
          chapter={journey.chapters.manjha}
          onContinue={() => go('manjha', 1)}
          onBack={() => go('manjha', -1)}
        />
      )
    }
    if (id === 'ceremony') {
      return (
        <CeremonyScreen
          active={active}
          onContinue={() => go('ceremony', 1)}
          onBack={() => go('ceremony', -1)}
        />
      )
    }
    if (id === 'details') {
      return (
        <DetailsScreen
          active={active}
          onContinue={() => go('details', 1)}
          onBack={() => go('details', -1)}
        />
      )
    }
    if (id === 'wedding') {
      return (
        <WeddingScreen
          active={active}
          chapter={journey.chapters.wedding}
          onContinue={() => go('wedding', 1)}
          onBack={() => go('wedding', -1)}
        />
      )
    }
    if (id === 'baraat') {
      return (
        <BaraatScreen
          active={active}
          onContinue={() => go('baraat', 1)}
          onBack={() => go('baraat', -1)}
        />
      )
    }
    if (id === 'schedule') {
      return (
        <BaraatDetailsScreen
          active={active}
          onContinue={() => go('schedule', 1)}
          onBack={() => go('schedule', -1)}
        />
      )
    }
    if (id === 'reception') {
      return (
        <ReceptionScreen
          active={active}
          chapter={journey.chapters.reception}
          onContinue={() => go('reception', 1)}
          onBack={() => go('reception', -1)}
        />
      )
    }
    if (id === 'evening') {
      return (
        <EveningScreen
          active={active}
          onContinue={() => go('evening', 1)}
          onBack={() => go('evening', -1)}
        />
      )
    }
    if (id === 'receptionDetails') {
      return (
        <ReceptionDetailsScreen
          active={active}
          onContinue={() => go('receptionDetails', 1)}
          onBack={() => go('receptionDetails', -1)}
        />
      )
    }
    if (id === 'families') {
      return (
        <FamiliesScreen
          active={active}
          onContinue={() => go('families', 1)}
          onBack={() => go('families', -1)}
        />
      )
    }
    if (id === 'rsvp') {
      return (
        <RsvpScreen
          active={active}
          eventIds={journey.rsvpEvents}
          onContinue={() => go('rsvp', 1)}
          onBack={() => go('rsvp', -1)}
        />
      )
    }
    if (id === 'closing') return <ClosingScreen active={active} onBack={() => go('closing', -1)} />
    return null
  }

  const shown = outgoing ? [outgoing, page] : [page]

  return (
    <div className="app-shell" data-page={page} data-version={journey.id}>
      <div className="app-shell__ambient" aria-hidden="true" />
      <audio ref={musicRef} src="/audio/song.m4a" loop preload="none" />
      <main className="phone-stage">
        {shown.map((id) => (
          <div
            key={id}
            className={`stage-pane ${id === page ? 'is-current' : 'is-previous'}`}
          >
            {renderPage(id, id === page)}
          </div>
        ))}
      </main>
    </div>
  )
}
