import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf8')

const rootTitle = 'Maaz & Afza | Wedding Invitation'
const receptionTitle = 'Maaz & Afza | Wedding Reception Invitation'

const pages = {
  walima: {
    title: receptionTitle,
  },
  wedding: {
    title: rootTitle,
  },
  reception: {
    title: receptionTitle,
  },
}

function nest(page) {
  return page
    .replaceAll('href="./', 'href="../')
    .replaceAll('src="./', 'src="../')
}

for (const [path, copy] of Object.entries(pages)) {
  const page = nest(html.replaceAll(rootTitle, copy.title))
  mkdirSync(`dist/${path}`, { recursive: true })
  writeFileSync(`dist/${path}/index.html`, page)
}

writeFileSync('dist/404.html', html)

const redirect = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Maaz & Afza | Wedding Reception Invitation</title>
<link rel="canonical" href="../walima/">
<meta http-equiv="refresh" content="0; url=../walima/">
<script>location.replace(location.pathname.replace(/\\/manjha\\/?$/, '/walima') + location.search + location.hash)</script>
</head>
<body></body>
</html>
`
mkdirSync('dist/manjha', { recursive: true })
writeFileSync('dist/manjha/index.html', redirect)
