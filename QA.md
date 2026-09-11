# LeadLexity — delivery checks

Verified against the production build on **10 September 2026**.

## Results

- **109 automated checks passed.** No failed or skipped checks in the final run.
- All five required routes checked in light and dark mode at **320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920 pixels**.
- No detected horizontal overflow, clipped headings, oversized buttons, or distorted logos at those sizes.
- WCAG A/AA automated scans passed for all five routes in both themes, plus the invalid-form state.
- Desktop, tablet, and mobile screenshots reviewed; the tablet hero is intentionally reorganized and mobile contact fields are stacked.
- Theme defaults to System, responds to system changes, and preserves manual preferences across pages and reloads.
- Mobile menu, focus handling, Escape dismissal, working navigation/anchor links, keyboard theme controls, and the custom 404 checked.
- Form validation, service preselection, exclusive “Not Sure Yet” behavior, real brief download, clipboard success/fallback, and editing checked.
- Brief-only mode makes no submission request and stores no personal information in localStorage.
- Integration failure/acceptance states tested against an intercepted test endpoint. **This is not a live CRM delivery test.**
- Production build: zero Astro / TypeScript errors, warnings, or hints.
- Dependency audit: no reported vulnerabilities at the time of verification.

## Original logo integrity

Both website assets have exactly the same SHA-256 hash as the supplied files. Their original 1100 × 218 proportions, transparency, and colors are preserved. The two variants are switched, not recolored.

## Performance foundations

- Static, pre-rendered multi-page HTML.
- No browser framework runtime, CDN fonts, external images, analytics, or trackers.
- Shared browser JavaScript: **4,338 bytes** uncompressed, **1,571 bytes** gzip.
- Contact-only form JavaScript: **7,257 bytes** uncompressed, **3,007 bytes** gzip.
- One self-hosted variable font, small original logo PNGs, and CSS/vector illustrations.

These are measured asset sizes, not a guarantee of performance on every network or device.

## Deliberately pending

- Verified public domain for absolute canonical / social URLs and populated sitemap.
- Real email, phone, WhatsApp, and Messenger details.
- Live calendar and/or a real lead endpoint.
- Owner-approved privacy wording as appropriate before live data collection.
- Permissioned, verified case studies.

No clients, performance results, testimonials, awards, team members, addresses, or booking confirmations have been invented.

## Scope

The automated browser suite uses Chromium with viewport and color-scheme emulation. This is not a claim of physical-device testing, a comprehensive cross-browser certification, or a formal accessibility conformance audit. See `README.md` for launch configuration and repeatable test commands.
