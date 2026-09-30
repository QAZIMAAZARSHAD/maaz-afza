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

export function preloadImages(urls) {
  if (typeof Image === 'undefined') return
  for (const url of urls) {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}
