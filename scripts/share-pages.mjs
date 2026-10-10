import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf8')

const pages = {
  manjha: {
    title: 'Maaz weds Afza - Manjha',
    description: 'You are warmly invited to the manjha of Qazi Maaz Arshad.',
  },
  wedding: {
    title: 'Maaz weds Afza - Wedding',
    description: 'You are warmly invited to the wedding of Qazi Maaz Arshad and Afza Aslam.',
  },
  reception: {
    title: 'Maaz weds Afza - Reception',
    description: 'You are warmly invited to the wedding reception of Qazi Maaz Arshad and Afza Aslam.',
  },
}

const rootTitle = 'Maaz weds Afza - A new chapter begins'
const rootDescription = 'You are warmly invited to the celebrations of Qazi Maaz Arshad and Afza Aslam.'

for (const [path, copy] of Object.entries(pages)) {
  const page = html
    .replaceAll(rootTitle, copy.title)
    .replaceAll(rootDescription, copy.description)
  mkdirSync(`dist/${path}`, { recursive: true })
  writeFileSync(`dist/${path}/index.html`, page)
}
