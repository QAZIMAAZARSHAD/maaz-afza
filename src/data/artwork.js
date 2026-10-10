export const ARTWORK = {
  opening: '/images/page-01.webp',
  cover: '/images/page-02.webp',
  couple: '/images/couple.webp',
  inviteV1: '/images/page-03-v1.webp',
  inviteV2: '/images/page-03-v2.webp',
  inviteV3: '/images/page-03-v3.webp',
  manjha: '/images/page-04.webp',
  ceremony: '/images/page-05.webp',
  details: '/images/page-06.webp',
  wedding: '/images/page-07.webp',
  baraat: '/images/page-08.webp',
  schedule: '/images/page-09.webp',
  reception: '/images/page-10.webp',
  evening: '/images/page-11.webp',
  receptionDetails: '/images/page-12.webp',
  families: '/images/page-14.webp',
  rsvp: '/images/page-15.webp',
  closing: '/images/page-16.webp',
}

export function imagesForPage(pageId, versionId = 'v1') {
  if (pageId === 'invitation') {
    if (versionId === 'v4') return [ARTWORK.inviteV3]
    if (versionId === 'v2' || versionId === 'v3') return [ARTWORK.inviteV2]
    return [ARTWORK.inviteV1]
  }
  if (pageId === 'cover') return [ARTWORK.cover, ARTWORK.couple]
  const src = ARTWORK[pageId]
  return src ? [src] : []
}

const queued = new Set()
const pending = []
let pumping = false

export function preloadImages(urls, urgent = false) {
  if (typeof Image === 'undefined') return
  const fresh = []
  for (const url of urls) {
    if (!url) continue
    const waiting = pending.indexOf(url)
    if (waiting >= 0) {
      if (urgent) pending.splice(waiting, 1)
      else continue
    } else if (queued.has(url)) {
      continue
    }
    queued.add(url)
    fresh.push(url)
  }
  if (urgent) pending.unshift(...fresh)
  else pending.push(...fresh)
  pump()
}

function pump() {
  if (pumping || pending.length === 0) return
  pumping = true
  const url = pending.shift()
  const img = new Image()
  img.decoding = 'async'
  const done = () => {
    pumping = false
    pump()
  }
  img.onload = done
  img.onerror = done
  img.src = url
}
