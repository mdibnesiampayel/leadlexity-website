# LeadLexity

A complete, multi-page digital growth agency website. Built with Astro, TypeScript, self-hosted Manrope, and a small amount of framework-free browser JavaScript.

**Brand accent:** `#02D3BE`  
**Tagline:** Where Creativity Meets Conversion

## Included

- `/` — positioning, six services, connected growth approach, process, case-library preview, and strategy-call CTA.
- `/about` — mission, philosophy, and five brand values. No invented team biographies.
- `/services` — six detailed service sections, accessible anchor navigation, and service-specific enquiry links.
- `/case-studies` — intentionally designed empty library. Data-driven cards and project pages are ready for approved work.
- `/contact` — accessible lead brief form, integration-ready booking, honest contact placeholders, and FAQ.
- Custom `404`, `robots.txt`, and a sitemap endpoint.
- Persistent **Light / Dark / System** preference, defaulting to System and responding to live system changes.
- Mobile navigation with keyboard handling, focus containment, Escape dismissal, and background scroll locking.
- Reduced-motion support, local fonts, optimized PNG assets, Open Graph image, semantic HTML, and Organization metadata.

## The supplied logos

The two official PNG files are copied **byte-for-byte**, not recreated, recolored, cropped, filtered, or edited:

| Supplied file                           | Website asset                       | Use            |
| --------------------------------------- | ----------------------------------- | -------------- |
| `Horizontal Transparent Main-Black.png` | `public/brand/leadlexity-black.png` | Light surfaces |
| `Horizontal Transparent Main-White.png` | `public/brand/leadlexity-white.png` | Dark surfaces  |

`src/components/Logo.astro` is the single shared logo component. Header and footer use the original 1100 × 218 aspect ratio. The header has **no additional text-based wordmark**. The Open Graph composition also places the original black PNG without changing its artwork. The complete, uncropped logos are used for browser icons; no separate brand symbol has been invented.

## Run locally

Use **Node 22.19 or newer**. `.nvmrc` selects Node 22.

```bash
nvm use
npm ci
npm run dev
```

The development site listens on `0.0.0.0:4321`. The dev server accepts the hosted preview environment; browser code does not depend on a localhost API.

```bash
npm run check     # Astro / TypeScript checks
npm run build     # Checks + static production build
npm run preview   # Preview the production output
```

`dist/` is the deployable static website. It requires an HTTP server; opening the HTML with `file://` is not a supported deployment because asset and page URLs are root-relative.

## Launch configuration — no invented details

Copy `.env.example` to `.env` locally, or set the same variables in your hosting provider. Rebuild after changing them.

| Variable               | Purpose                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`      | The **verified production origin**, including `https://`, without a trailing slash. |
| `PUBLIC_BOOKING_URL`   | Your actual scheduling / calendar URL.                                              |
| `PUBLIC_LEAD_ENDPOINT` | An HTTPS endpoint that accepts the lead JSON described below.                       |
| `PUBLIC_CONTACT_EMAIL` | Your verified agency email.                                                         |
| `PUBLIC_CONTACT_PHONE` | Your real phone number, ideally with country code.                                  |
| `PUBLIC_WHATSAPP_URL`  | Your actual WhatsApp conversation URL.                                              |
| `PUBLIC_MESSENGER_URL` | Your actual Messenger URL.                                                          |

Empty fields are deliberate. No email, phone number, calendar URL, address, client, testimonial, or performance metric has been fabricated.

### Booking behavior

- **No booking URL:** strategy-call buttons lead to `/contact#strategy-call`.
- **Booking URL configured:** primary call CTAs open the real calendar in a new tab. The contact form also provides a calendar link.
- **No lead endpoint:** the form operates in clearly labeled **brief-only mode**. It validates inputs and prepares a downloadable / copyable project brief. It does **not** submit, save, email, or book anything.
- **Lead endpoint configured:** the form sends an enquiry, with pending, failure, and confirmed-acceptance states. It never describes an enquiry as a confirmed calendar booking.

Personal form information is not saved to localStorage. Only the theme preference is persisted. Brief-only data stays in the current page’s memory unless the visitor chooses to copy or download it.

### Lead endpoint contract

The frontend sends a JSON `POST` with `Content-Type: application/json` and `Accept: application/json`:

```ts
{
  fullName: string;
  businessName: string;
  email: string;
  phone: string;          // Optional, empty string if omitted
  website: string;        // Optional; normalized HTTP(S) URL
  businessType: string;   // Optional
  services: string[];
  budget: string;         // Optional, ranges are in USD
  goals: string;
  preparedAt: string;     // ISO timestamp
  source: 'LeadLexity website';
  websiteCheck: '';       // Honeypot
}
```

Return a 2xx status and **`{ "ok": true }` only after the enquiry has been durably accepted**. Any other status, invalid JSON, a false `ok`, or a 15-second timeout produces an honest error and keeps the entered details available for retry.

Before enabling a real endpoint:

1. Implement server-side field validation, size limits, sanitization, spam controls, and rate limiting. Browser validation is for usability, not security.
2. Allow CORS only from the verified website origin, if the endpoint is on a different host.
3. Keep provider credentials **on the server**. Never place secrets in `PUBLIC_` variables.
4. Connect the endpoint to the real CRM / mail workflow and test actual delivery.
5. Add the appropriate owner-approved privacy notice and any legally required consent for your operating jurisdictions. Do not invent legal policies.

There is deliberately no pretend backend or simulated successful submission.

## Technical SEO

Each page has its own title, description, canonical link, Open Graph data, Twitter card, and semantic heading hierarchy. The structured data uses only accurate Organization fields; no physical address, ratings, or LocalBusiness claims are assumed.

Until `PUBLIC_SITE_URL` is supplied, canonical links are relative to the real host where the page is viewed. Absolute social URLs and the sitemap are finalized by setting that environment variable and rebuilding. The sitemap stays intentionally empty instead of claiming a guessed agency domain. `robots.txt` adds the correct sitemap URL when configured.

The prepared `public/og-image.png` is 1200 × 630. To regenerate it after approved copy changes:

```bash
npx playwright install chromium
node scripts/create-og.mjs
```

## Publishing real case studies

Edit `src/data/case-studies.ts`. The collection is intentionally empty.

The `CaseStudy` type supports:

- Slug, client / business, industry, title, summary, and services.
- Challenge, strategy, execution, and verified results.
- Optional before / after metrics, with reporting period and source.
- Optional campaign and website screenshots, with explicit dimensions, meaningful alt text, and captions.
- Key takeaways, publication date, and explicit publication approval.

Only add permissioned, verified work. No demonstration client or invented numerical result is included. Adding an approved entry automatically creates its library card, homepage preview, sitemap entry, and `/case-studies/[slug]` page on the next build.

## Design system and organization

```text
src/
  components/     Navbar, Footer, Logo, Button, ThemeSwitcher, CTA,
                  SectionHeading, ServiceCard, LeadForm, FormField,
                  GrowthVisual, CaseVisual, CaseStudyCard
  data/           Site configuration, services, typed case-study collection
  layouts/        Shared semantic page shell and SEO
  pages/          Real static page routes, 404, robots, and sitemap
  scripts/        Theme / navigation / reveal behavior and safe lead form
  styles/         Design tokens, shared components, and page-specific styles
public/
  brand/          Original supplied PNGs
  fonts/          Self-hosted variable font + OFL license
  og-image.png    Branded sharing composition
scripts/          Sharing-image generator
tests/            Responsive, accessibility, navigation, and form tests
```

Design tokens live in `src/styles/global.css`. Brand turquoise is an accent, not the whole palette. Dark ink is used on turquoise buttons; a darker accessible teal is used for small accent-colored text on light backgrounds. Layouts intentionally reorganize across desktop, tablet, and mobile rather than simply scaling down.

No analytics, advertising pixels, embedded third-party calendar, browser CDN, or external font dependency is enabled by default.

## QA

```bash
npx playwright install --with-deps chromium
npm test
```

The automated suite covers all five pages in light and dark mode at:

**320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920 pixels.**

It checks overflow, headings, original logo dimensions, responsive navigation, WCAG A/AA scans, real links and anchor targets, metadata, theme persistence, keyboard interactions, service preselection, form validation, downloads, integration errors and accepted responses, no-JS safety, and the 404 page. QA data is test-only and never published as client work.

Automated accessibility tests are a useful baseline, not a substitute for a full human assistive-technology audit.

## Deployment

- **Netlify:** `netlify.toml` is included; build with `npm run build`, publish `dist`.
- **Cloudflare Pages / another static host:** use Node 22+, the same build command and output directory. Serve clean directory URLs and the generated 404 page.
- `_headers` includes basic security and cache headers for hosts that support this format. Configure equivalent headers on other servers.
- Use HTTPS, configure your verified origin, and test real calendar / CRM delivery before announcing a live booking service.

**Launch blockers that require the agency owner:** verified production domain, real contact details, calendar URL and/or a working lead endpoint, and any applicable privacy wording. Everything else is implemented without fabricated social proof.
