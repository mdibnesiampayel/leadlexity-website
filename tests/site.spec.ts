import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const routes = ['/', '/about', '/services', '/case-studies', '/contact'];
const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

for (const theme of ['light', 'dark'] as const) {
  for (const route of routes) {
    for (const width of widths) {
      test(`${theme} · ${route} · ${width}px`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.setViewportSize({ width, height: 960 });
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const dimensions = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        expect(dimensions.scroll, `Horizontal overflow at ${route} ${width}px`).toBeLessThanOrEqual(
          dimensions.width,
        );
        const overflow = await page
          .locator(
            'main h1, main h2, main h3, .button, .service-card, .form-field, .service-option',
          )
          .evaluateAll((elements) =>
            elements
              .filter((el) => {
                const rect = el.getBoundingClientRect();
                return (
                  rect.width > 0 &&
                  (rect.left < -1 ||
                    rect.right > innerWidth + 1 ||
                    (el as HTMLElement).scrollWidth > (el as HTMLElement).clientWidth + 2)
                );
              })
              .map((el) => ({
                tag: el.tagName,
                class: el.className,
                text: el.textContent?.trim().slice(0, 80),
              })),
          );
        expect(overflow).toEqual([]);
        const logo = page.locator(`.site-header .brand__${theme}`);
        await expect(logo).toBeVisible();
        expect(
          await logo.evaluate(
            (el: HTMLImageElement) =>
              el.complete && el.naturalWidth === 1100 && el.naturalHeight === 218,
          ),
        ).toBe(true);
        const box = await logo.boundingBox();
        expect(box!.width / box!.height).toBeCloseTo(1100 / 218, 1);
        expect(await page.locator('.site-header .brand').textContent()).toMatch(/^\s*$/);
        if (width <= 1080) {
          await expect(page.locator('#mobile-toggle')).toBeVisible();
          await expect(page.locator('.desktop-nav')).toBeHidden();
        } else {
          await expect(page.locator('.desktop-nav')).toBeVisible();
          await expect(page.locator('.nav-cta')).toBeVisible();
        }
      });
    }
    test(`WCAG A/AA scan · ${theme} · ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: theme === 'dark' ? 390 : 1440, height: 1000 });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(audit.violations).toEqual([]);
    });
  }
}

test('Theme: system default, live OS changes, manual override, persistence, and keyboard controls', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'system');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('[data-theme-value="system"]')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('[data-theme-value="light"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/about');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('leadlexity-theme'))).toBe('light');
  await page.locator('#theme-toggle').click();
  await page.locator('[data-theme-value="dark"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-toggle').click();
  await page.locator('[data-theme-value="system"]').click();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('#theme-toggle').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#theme-menu')).toBeHidden();
  await expect(page.locator('#theme-toggle')).toBeFocused();
});

test('Mobile navigation: focus, escape, backdrop, links, and CTA', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.locator('#mobile-toggle').click();
  await expect(page.locator('#mobile-navigation')).toBeVisible();
  await expect(page.locator('#mobile-navigation a').first()).toBeFocused();
  await expect(page.locator('#main-content')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await expect(page.locator('#mobile-toggle')).toBeFocused();
  await page.locator('#mobile-toggle').click();
  await page.locator('#nav-backdrop').click({ position: { x: 15, y: 740 } });
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await page.locator('#mobile-toggle').click();
  await page
    .locator('#mobile-navigation')
    .getByRole('link', { name: 'Book a Free Strategy Call' })
    .click();
  await expect(page).toHaveURL(/\/contact#strategy-call$/);
  await expect(page.locator('#strategy-call')).toBeVisible();
  await expect(page.locator('#mobile-navigation')).toBeHidden();
});

test('Navigation links, anchor destinations, metadata, and local assets all resolve', async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /LeadLexity/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route);
    const org = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('LeadLexity');
    const pageLinks = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')!));
    pageLinks.forEach((link) => links.add(link));
    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter(
          (image) => image.loading !== 'lazy' && (!image.complete || image.naturalWidth === 0),
        )
        .map((image) => image.src),
    );
    expect(brokenImages).toEqual([]);
  }
  for (const link of links) {
    const response = await request.get(link);
    expect(response.status(), link).toBe(200);
    const hash = new URL(link, 'http://localhost:4321').hash;
    if (hash) expect(await response.text(), link).toContain(`id="${hash.slice(1)}"`);
  }
  for (const path of [
    '/robots.txt',
    '/sitemap.xml',
    '/og-image.png',
    '/fonts/manrope-latin-variable.woff2',
  ])
    expect((await request.get(path)).status(), path).toBe(200);
});

async function fillBrief(page: import('@playwright/test').Page) {
  await page.getByLabel('Full Name', { exact: false }).fill('Test Person');
  await page.getByLabel('Business Name', { exact: false }).fill('Test Business');
  await page.getByLabel('Email', { exact: false }).fill('test@example.com');
  await page.locator('#website').fill('example.com');
  await page.locator('#interest-seo').check();
  await page
    .locator('#goals')
    .fill('We would like to improve our website and build a clearer path to relevant enquiries.');
}

test('Brief-only form: validation, service selection, no network submission, download, and edit', async ({
  page,
}) => {
  const sentRequests: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') sentRequests.push(request.url());
  });
  await page.goto('/contact?service=google-ads#strategy-call');
  await expect(page.locator('#interest-google-ads')).toBeChecked();
  await page.locator('#submit-brief').click();
  await expect(page.locator('#form-errors')).toBeVisible();
  await expect(page.locator('#full-name')).toBeFocused();
  await fillBrief(page);
  await page.locator('#interest-not-sure').check();
  await expect(page.locator('#interest-seo')).not.toBeChecked();
  await expect(page.locator('#interest-google-ads')).not.toBeChecked();
  await page.locator('#interest-seo').check();
  await expect(page.locator('#interest-not-sure')).not.toBeChecked();
  await page.locator('#submit-brief').click();
  await expect(page.locator('#brief-result')).toBeVisible();
  await expect(page.locator('#brief-result-title')).toHaveText('Your brief is ready.');
  await expect(page.locator('#brief-result-message')).toContainText('has not been sent');
  await expect(page.locator('#brief-result-message')).toContainText('no call has been booked');
  await expect(page.locator('#brief-summary')).toContainText('https://example.com/');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download-brief').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('leadlexity-project-brief.txt');
  const text = await readFile((await download.path())!, 'utf8');
  expect(text).toContain('NOT sent. A call has NOT been booked.');
  expect(text).toContain('Business name: Test Business');
  await page.locator('#edit-brief').click();
  await expect(page.locator('#lead-form')).toBeVisible();
  await expect(page.locator('#full-name')).toHaveValue('Test Person');
  expect(sentRequests).toEqual([]);
  expect(
    await page.evaluate(() => Object.keys(localStorage).filter((k) => k !== 'leadlexity-theme')),
  ).toEqual([]);
});

test('Form: meaningful optional-field errors and accessible invalid state', async ({ page }) => {
  await page.goto('/contact');
  await fillBrief(page);
  await page.locator('#phone').fill('not a phone number');
  await page.locator('#website').fill('javascript:alert(1)');
  await page.locator('#submit-brief').click();
  await expect(page.locator('#phone-error')).toBeVisible();
  await expect(page.locator('#website-error')).toBeVisible();
  await expect(page.locator('#phone')).toBeFocused();
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test('Integration adapter: failures retain data, only verified success shows sent, never booked', async ({
  page,
}) => {
  await page.goto('/contact');
  await fillBrief(page);
  await page.locator('#lead-form').evaluate((el) => {
    (el as HTMLElement).dataset.endpoint = '/__qa/lead';
  });
  await page.route('**/__qa/lead', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false }),
    }),
  );
  await page.locator('#submit-brief').click();
  await expect(page.locator('#request-error')).toBeVisible();
  await expect(page.locator('#full-name')).toHaveValue('Test Person');
  await expect(page.locator('#brief-result')).toBeHidden();
  await page.unroute('**/__qa/lead');
  await page.route('**/__qa/lead', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    }),
  );
  await page.locator('#submit-brief').click();
  await expect(page.locator('#brief-result-title')).toHaveText('Your enquiry has been sent.');
  await expect(page.locator('#brief-result-message')).toContainText('No call has been booked');
});

test('Case library is intentional, FAQ works, reduced motion is honored, and 404 is useful', async ({
  page,
}) => {
  await page.goto('/case-studies');
  await expect(page.locator('h1')).toContainText('Coming soon.');
  await expect(page.locator('.case-study-card')).toHaveCount(0);
  await expect(page.locator('.will-reveal')).toHaveCount(0);
  await page.goto('/contact');
  await page.getByText('What happens when I complete the form?', { exact: true }).click();
  await expect(page.locator('details[open] p')).toContainText('not sent anywhere');
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('back on track');
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('http://localhost:4321/');
});

test('No-JS: semantic content, theme-aware logo, and safe disabled lead form', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/contact');
  await expect(page.locator('h1')).toContainText('growth');
  await expect(page.locator('.site-header .brand__dark')).toBeVisible();
  await expect(page.locator('#submit-brief')).toBeDisabled();
  await expect(page.locator('.form-noscript')).toBeVisible();
  await context.close();
});

test('Copy brief: real clipboard success and an honest permission-denied fallback', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/contact');
  await fillBrief(page);
  await page.locator('#submit-brief').click();
  await page.locator('#copy-brief').click();
  await expect(page.locator('#brief-action-status')).toHaveText('Brief copied to your clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Business name: Test Business',
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Permission denied in this test');
    };
  });
  await page.locator('#copy-brief').click();
  await expect(page.locator('#brief-action-status')).toContainText(
    'Clipboard access is unavailable',
  );
});
