import { useEffect, useState } from 'react'
import OpeningScreen from './pages/OpeningScreen.jsx'
import CoverScreen from './pages/CoverScreen.jsx'
import InvitationScreen from './pages/InvitationScreen.jsx'
import ManjhaScreen from './pages/ManjhaScreen.jsx'
import CeremonyScreen from './pages/CeremonyScreen.jsx'
import DetailsScreen from './pages/DetailsScreen.jsx'
import WeddingScreen from './pages/WeddingScreen.jsx'

export default function App() {
  const [page, setPage] = useState('opening')
  const [inviteVersion, setInviteVersion] = useState('v1')

  useEffect(() => {
    if (page !== 'next') return undefined
    const onWheel = (event) => {
      if (event.deltaY < -18) setPage('wedding')
    }
    const onKey = (event) => {
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        setPage('wedding')
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [page])

  return (
    <div className="app-shell" data-page={page}>
      <div className="app-shell__ambient" aria-hidden="true" />
      <main className="phone-stage">
        {page === 'opening' && (
          <OpeningScreen onEnter={() => setPage('cover')} />
        )}
        {page === 'cover' && (
          <CoverScreen
            onOpen={() => setPage('invitation')}
            onBack={() => setPage('opening')}
          />
        )}
        {page === 'invitation' && (
          <InvitationScreen
            versionId={inviteVersion}
            onVersionChange={setInviteVersion}
            onContinue={() => setPage('manjha')}
            onBack={() => setPage('cover')}
          />
        )}
        {page === 'manjha' && (
          <ManjhaScreen
            onContinue={() => setPage('ceremony')}
            onBack={() => setPage('invitation')}
          />
        )}
        {page === 'ceremony' && (
          <CeremonyScreen
            onContinue={() => setPage('details')}
            onBack={() => setPage('manjha')}
          />
        )}
        {page === 'details' && (
          <DetailsScreen
            onContinue={() => setPage('wedding')}
            onBack={() => setPage('ceremony')}
          />
        )}
        {page === 'wedding' && (
          <WeddingScreen
            onContinue={() => setPage('next')}
            onBack={() => setPage('details')}
          />
        )}
        {page === 'next' && (
          <div className="pending-page">
            <p className="pending-page__kicker">Next in the journey</p>
            <h1>Next</h1>
            <p>Page 8 — ready when you are</p>
          </div>
        )}
      </main>
    </div>
  )
}
