const PAGES = {
  v1: [
    'opening',
    'cover',
    'invitation',
    'manjha',
    'ceremony',
    'details',
    'wedding',
    'baraat',
    'schedule',
    'reception',
    'evening',
    'receptionDetails',
    'families',
    'rsvp',
    'closing',
  ],
  v2: [
    'opening',
    'cover',
    'invitation',
    'manjha',
    'ceremony',
    'details',
    'reception',
    'evening',
    'receptionDetails',
    'families',
    'rsvp',
    'closing',
  ],
  v3: [
    'opening',
    'cover',
    'invitation',
    'wedding',
    'baraat',
    'schedule',
    'reception',
    'evening',
    'receptionDetails',
    'families',
    'rsvp',
    'closing',
  ],
  v4: [
    'opening',
    'cover',
    'invitation',
    'reception',
    'evening',
    'receptionDetails',
    'families',
    'rsvp',
    'closing',
  ],
}

export const JOURNEYS = {
  v1: {
    id: 'v1',
    path: '/',
    title: 'All events',
    pages: PAGES.v1,
    chapters: {
      manjha: 'Chapter I',
      wedding: 'Chapter II',
      reception: 'Chapter III',
    },
    rsvpEvents: ['manjha', 'baraat', 'reception'],
    shareTitle: 'Maaz & Afza | Wedding Invitation',
    shareDescription: 'We warmly invite you to join us for our wedding celebrations.',
  },
  v2: {
    id: 'v2',
    path: '/manjha',
    title: 'Manjha and reception',
    pages: PAGES.v2,
    chapters: {
      manjha: 'Chapter I',
      reception: 'Chapter II',
    },
    rsvpEvents: ['manjha', 'reception'],
    shareTitle: 'Maaz & Afza | Wedding Reception Invitation',
    shareDescription: 'We warmly invite you to join us for our wedding celebrations.',
  },
  v3: {
    id: 'v3',
    path: '/wedding',
    title: 'Wedding and reception',
    pages: PAGES.v3,
    chapters: {
      wedding: 'Chapter I',
      reception: 'Chapter II',
    },
    rsvpEvents: ['wedding', 'reception'],
    shareTitle: 'Maaz & Afza | Wedding Invitation',
    shareDescription: 'We warmly invite you to join us for our wedding celebrations.',
  },
  v4: {
    id: 'v4',
    path: '/reception',
    title: 'Reception only',
    pages: PAGES.v4,
    chapters: {
      reception: null,
    },
    rsvpEvents: ['reception'],
    shareTitle: 'Maaz & Afza | Wedding Reception Invitation',
    shareDescription: 'We warmly invite you to join us for our wedding celebrations.',
  },
}

const BY_PATH = Object.fromEntries(
  Object.values(JOURNEYS).map((journey) => [journey.path, journey]),
)

export function journeyFromPath(pathname = window.location.pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  return BY_PATH[path] ?? JOURNEYS.v1
}
