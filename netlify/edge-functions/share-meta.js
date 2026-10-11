export default async (request, context) => {
  const response = await context.next()
  const type = response.headers.get('content-type') || ''
  if (!type.includes('text/html')) return response

  const url = new URL(request.url)
  const image = `${url.origin}/share.jpg`
  const page = `${url.origin}${url.pathname}`
  let html = await response.text()
  html = html.replaceAll(/content="[^"]*share\.jpg"/g, `content="${image}"`)
  if (!html.includes('property="og:url"')) {
    html = html.replace('</head>', `    <meta property="og:url" content="${page}" />\n  </head>`)
  }

  const headers = new Headers(response.headers)
  headers.delete('content-length')
  return new Response(html, { status: response.status, headers })
}
