import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5199'
let requests = []

test.beforeEach(async ({ page }) => {
  requests = []
  page.on('request', (req) => requests.push(req.url()))
})

test('vs computer flow, stats, settings and persistence', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Vs computer' }).click()
  await page.getByRole('button', { name: 'Unbeatable', exact: true }).click()
  await page.getByRole('button', { name: 'Start game' }).click()

  const result = page.getByTestId('result-title')
  const yourTurn = page.locator('[data-testid="status"]').filter({ hasText: 'Your turn' })

  // Human plays X. Unbeatable never loses, so the game ends in a draw (9 moves) at most.
  for (let i = 0; i < 9; i++) {
    if (await result.count()) break
    await page.locator('button[data-cell]:not([disabled])').first().click()
    await expect(result.or(yourTurn)).toBeVisible()
  }

  await expect(result).toBeVisible()
  expect(await page.getByTestId('move-log').locator('li').count()).toBeGreaterThanOrEqual(5)

  await page.getByRole('button', { name: 'Rematch', exact: true }).click()
  await page.getByRole('button', { name: 'Stats', exact: true }).click()
  await expect(page.getByTestId('games').locator('li')).toHaveCount(1)
  await expect(page.getByTestId('totals').locator('div').filter({ hasText: 'Played' })).toContainText('1')

  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await page.getByRole('button', { name: 'Night', exact: true }).click()
  await expect(page.locator('html[data-theme="night"]')).toHaveCount(1)
  await page.getByRole('button', { name: 'فارسی', exact: true }).click()
  await expect(page.locator('html[dir="rtl"]')).toHaveCount(1)
  await expect(page.locator('html[lang="fa"]')).toHaveCount(1)

  await page.reload()
  await expect(page.locator('html[dir="rtl"]')).toHaveCount(1)

  const offOrigin = requests.filter(
    (u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'),
  )
  expect(offOrigin).toEqual([])
})

test('blocked storage shows the fallback alert on Stats', async ({ page }) => {
  await page.addInitScript(() => {
    const fail = () => { throw new Error('storage blocked') }
    Storage.prototype.getItem = fail
    Storage.prototype.setItem = fail
    Storage.prototype.removeItem = fail
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Stats', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Storage is blocked')
})
