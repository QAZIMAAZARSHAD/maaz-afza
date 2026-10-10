import { expect, test } from '@playwright/test'

async function stageBox(page) {
  return page.locator('.phone-stage').boundingBox()
}

async function advance(page) {
  await page.waitForSelector('.stage-pane.is-current .is-ready')
  const before = await page.locator('.app-shell').getAttribute('data-page')
  if (before === 'opening') await page.locator('.stage-pane.is-current .opening__cta').click()
  else await page.keyboard.press('ArrowDown')
  await page.waitForFunction(
    (prev) => document.querySelector('.app-shell')?.getAttribute('data-page') !== prev,
    before,
  )
  await page.waitForSelector('.stage-pane.is-current .is-ready')
}

test.describe('mobile layout', () => {
  for (const [name, width, height] of [
    ['iPhone SE', 375, 667],
    ['iPhone 14', 390, 844],
    ['Samsung / Realme', 360, 800],
    ['large Android', 412, 915],
  ]) {
    test(`${name} fills the screen`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.waitForSelector('.opening.is-ready')
      const box = await stageBox(page)
      expect(Math.round(box.width)).toBe(width)
      expect(Math.round(box.height)).toBe(height)
    })
  }
})

test('desktop keeps a single framed stage', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await page.waitForSelector('.opening.is-ready')
  const box = await stageBox(page)
  expect(box.width).toBeLessThan(500)
  expect(box.height).toBeLessThan(800)
  const ratio = box.width / box.height
  expect(ratio).toBeCloseTo(941 / 1672, 2)
})

test('guest links open the matching journey', async ({ page }) => {
  await page.goto('/walima')
  await expect(page.locator('.app-shell')).toHaveAttribute('data-version', 'v2')
  await page.goto('/wedding')
  await expect(page.locator('.app-shell')).toHaveAttribute('data-version', 'v3')
  await page.goto('/reception')
  await expect(page.locator('.app-shell')).toHaveAttribute('data-version', 'v4')
})

test('scrolling back and forth does not freeze a page', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.opening.is-ready')
  await advance(page)
  await advance(page)
  await advance(page)
  await expect(page.locator('.app-shell')).toHaveAttribute('data-page', 'manjha')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.app-shell')).toHaveAttribute('data-page', 'invitation')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.app-shell')).toHaveAttribute('data-page', 'manjha')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.app-shell')).toHaveAttribute('data-page', 'ceremony')
})

test('opening artwork is the compressed image', async ({ page }) => {
  const images = []
  page.on('response', (response) => {
    const url = response.url()
    if (url.includes('/images/')) images.push({ url, size: Number(response.headers()['content-length'] || 0) })
  })
  await page.goto('/')
  await page.waitForSelector('.opening.is-ready')
  const art = images.find((item) => item.url.includes('page-01.webp'))
  expect(art).toBeTruthy()
  expect(art.size).toBeGreaterThan(0)
  expect(art.size).toBeLessThan(400_000)
})

test('copy stays inside the stage on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  await page.waitForSelector('.opening.is-ready')
  for (let step = 0; step < 4; step += 1) {
    await page.waitForTimeout(300)
    const overflow = await page.evaluate(() => {
      const stage = document.querySelector('.phone-stage').getBoundingClientRect()
      const current = document.querySelector('.stage-pane.is-current')
      const bad = []
      for (const el of current.querySelectorAll('h1, p')) {
        const rect = el.getBoundingClientRect()
        if (rect.width < 2 || rect.height < 2) continue
        if (rect.right > stage.right + 2 || rect.left < stage.left - 2 || rect.bottom > stage.bottom + 2) {
          bad.push((el.textContent || '').trim().slice(0, 40))
        }
      }
      return bad
    })
    expect(overflow).toEqual([])
    if (step < 3) await advance(page)
  }
})
