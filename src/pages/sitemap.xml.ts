import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { publishedCaseStudies } from '../data/case-studies';
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const GET: APIRoute = () => {
  const paths = [
    '/',
    '/about',
    '/services',
    '/case-studies',
    '/contact',
    ...publishedCaseStudies.map((study) => `/case-studies/${study.slug}`),
  ];
  const urls = site.url
    ? paths
        .map((path) => `<url><loc>${escapeXml(new URL(path, site.url).href)}</loc></url>`)
        .join('\n')
    : '<!-- Set PUBLIC_SITE_URL to the verified production origin and rebuild to populate this sitemap. -->';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
