/**
 * Publish only verified, permissioned client work. This array is intentionally empty.
 * Adding an entry creates its card and /case-studies/[slug] page at build time.
 * Results, metrics, screenshots, and takeaways must be supplied, never invented.
 */
export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  services: string[];
  challenge: string;
  strategy: string;
  execution: string;
  results: string;
  metrics?: {
    label: string;
    before: string;
    after: string;
    period: string;
    source: string;
  }[];
  screenshots?: {
    src: string;
    alt: string;
    caption: string;
    type: 'campaign' | 'website';
    width: number;
    height: number;
  }[];
  takeaways: string[];
  publishedAt: string;
  approvedForPublication: true;
}

export const caseStudies: CaseStudy[] = [];
export const publishedCaseStudies = caseStudies.filter((study) => study.approvedForPublication);
