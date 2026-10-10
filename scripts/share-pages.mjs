import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf8')

const rootTitle = 'Maaz &amp; Afza | Wedding Invitation'
const receptionTitle = 'Maaz &amp; Afza | Wedding Reception Invitation'

const pages = {
  manjha: {
    title: receptionTitle,
  },
  wedding: {
    title: rootTitle,
  },
  reception: {
    title: receptionTitle,
  },
}

for (const [path, copy] of Object.entries(pages)) {
  const page = html.replaceAll(rootTitle, copy.title)
  mkdirSync(`dist/${path}`, { recursive: true })
  writeFileSync(`dist/${path}/index.html`, page)
}
