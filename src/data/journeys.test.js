import { describe, expect, it } from 'vitest'
import { ARTWORK, imagesForPage } from './artwork.js'
import { JOURNEYS, journeyFromPath } from './journeys.js'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../public', import.meta.url))

describe('journeys', () => {
  it('maps each public link to the right guest version', () => {
    expect(journeyFromPath('/').id).toBe('v1')
    expect(journeyFromPath('/walima').id).toBe('v2')
    expect(journeyFromPath('/wedding').id).toBe('v3')
    expect(journeyFromPath('/reception').id).toBe('v4')
    expect(journeyFromPath('/reception/').id).toBe('v4')
  })

  it('falls back to the full invitation for an unknown path', () => {
    expect(journeyFromPath('/unknown').id).toBe('v1')
  })

  it('numbers chapters from the events that guest actually sees', () => {
    expect(JOURNEYS.v1.chapters).toEqual({
      manjha: 'Chapter I',
      wedding: 'Chapter II',
      reception: 'Chapter III',
    })
    expect(JOURNEYS.v2.chapters.reception).toBe('Chapter II')
    expect(JOURNEYS.v3.chapters.wedding).toBe('Chapter I')
    expect(JOURNEYS.v4.chapters.reception).toBeNull()
  })

  it('drops events the guest is not invited to', () => {
    expect(JOURNEYS.v2.pages).not.toContain('wedding')
    expect(JOURNEYS.v2.pages).not.toContain('baraat')
    expect(JOURNEYS.v3.pages).not.toContain('manjha')
    expect(JOURNEYS.v4.pages).not.toContain('manjha')
    expect(JOURNEYS.v4.pages).not.toContain('wedding')
    expect(JOURNEYS.v1.rsvpEvents).toEqual(['manjha', 'baraat', 'reception'])
    expect(JOURNEYS.v4.rsvpEvents).toEqual(['reception'])
  })

  it('keeps every journey on the shared opening and closing', () => {
    for (const journey of Object.values(JOURNEYS)) {
      expect(journey.pages[0]).toBe('opening')
      expect(journey.pages.at(-1)).toBe('closing')
      expect(journey.pages).toContain('invitation')
      expect(journey.pages).toContain('rsvp')
    }
  })
})

describe('artwork', () => {
  it('points every screen at a compressed webp that exists', () => {
    for (const url of Object.values(ARTWORK)) {
      expect(url.endsWith('.webp')).toBe(true)
      expect(existsSync(resolve(root, `.${url}`))).toBe(true)
    }
  })

  it('chooses the invitation art for that version', () => {
    expect(imagesForPage('invitation', 'v1')).toEqual([ARTWORK.inviteV1])
    expect(imagesForPage('invitation', 'v2')).toEqual([ARTWORK.inviteV2])
    expect(imagesForPage('invitation', 'v3')).toEqual([ARTWORK.inviteV2])
    expect(imagesForPage('invitation', 'v4')).toEqual([ARTWORK.inviteV3])
    expect(imagesForPage('cover')).toEqual([ARTWORK.cover, ARTWORK.couple])
  })
})
