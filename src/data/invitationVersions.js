import { ARTWORK } from './artwork.js'

export const INVITE_VERSIONS = [
  {
    id: 'v1',
    label: 'V1',
    title: 'All events',
    bg: ARTWORK.inviteV1,
    layout: 'three',
    invite:
      'Would be delighted to have the pleasure of your company at the wedding of her grandson',
    note: 'Your presence will make this occasion even more special for us.',
    notePosition: 'mid',
    events: [
      { name: 'Manjha', date: '26 Jan 2027', x: '22.02%' },
      { name: 'Wedding', date: '28 Jan 2027', x: '49.84%' },
      { name: 'Reception', date: '30 Jan 2027', x: '77.72%' },
    ],
    footer: 'We look forward to\ncelebrating with you.',
  },
  {
    id: 'v2',
    label: 'V2',
    title: 'Manjha + Reception',
    bg: ARTWORK.inviteV2,
    layout: 'two',
    invite:
      'Would be delighted to have the pleasure of your company at the wedding of her grandson',
    note: 'Your presence and blessings are warmly invited as we celebrate this special journey.',
    notePosition: 'mid',
    events: [
      { name: 'Manjha', date: '26 Jan 2027', x: '32.2%' },
      { name: 'Reception', date: '30 Jan 2027', x: '67.4%' },
    ],
    footer: 'We look forward to\ncelebrating with you.',
  },
  {
    id: 'v3',
    label: 'V3',
    title: 'Wedding + Reception',
    bg: ARTWORK.inviteV2,
    layout: 'two',
    invite:
      'Would be delighted to have the pleasure of your company at the wedding of her grandson',
    note: 'Your presence and blessings are warmly invited as we celebrate this special journey.',
    notePosition: 'mid',
    events: [
      { name: 'Wedding', date: '28 Jan 2027', x: '32.2%' },
      { name: 'Reception', date: '30 Jan 2027', x: '67.4%' },
    ],
    footer: 'We look forward to\ncelebrating with you.',
  },
  {
    id: 'v4',
    label: 'V4',
    title: 'Reception only',
    bg: ARTWORK.inviteV3,
    layout: 'one',
    invite:
      'Would be delighted to have the pleasure of your company at the wedding reception of her grandson',
    note: 'Your presence will make this occasion even more special for us.',
    notePosition: 'below',
    events: [{ name: 'Wedding Reception', date: 'Saturday, 30 Jan 2027', x: '50%' }],
    footer: null,
  },
]
