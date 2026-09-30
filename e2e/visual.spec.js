import { expect, test } from '@playwright/test'

async function settle(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
      .gold-dust { visibility: hidden !important; }
      .cover__groom, .cover__bride, .cover__amp, .cover__kicker,
      .opening__cta, .cover__couple {
        opacity: 1 !important;
        filter: none !important;
      }
      .cover__groom, .cover__bride, .cover__amp {
        transform: translate(-50%, -50%) !important;
      }
      .cover__couple {
        transform: translateX(-50%) !important;
      }
    `,
  })
}

test('opening screen', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.opening.is-ready')
  await settle(page)
  await expect(page.locator('.phone-stage')).toHaveScreenshot('opening.png')
})

test('cover screen with the couple', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.opening.is-ready')
  await page.locator('.opening__cta').click()
  await page.waitForSelector('.cover.is-ready')
  await page.waitForTimeout(200)
  await settle(page)
  await expect(page.locator('.phone-stage')).toHaveScreenshot('cover.png')
})
