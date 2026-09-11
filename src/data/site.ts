const webUrl = (value: string | undefined) => {
  if (!value) return '';
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? value.replace(/\/$/, '') : '';
  } catch {
    return '';
  }
};

export const site = {
  name: 'LeadLexity',
  tagline: 'Where Creativity Meets Conversion',
  description:
    'A worldwide digital growth agency helping service-based businesses connect strategy, creative, and performance marketing to meaningful business growth.',
  url: webUrl(import.meta.env.PUBLIC_SITE_URL),
  bookingUrl: webUrl(import.meta.env.PUBLIC_BOOKING_URL),
  leadEndpoint: webUrl(import.meta.env.PUBLIC_LEAD_ENDPOINT),
  email: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
  phone: import.meta.env.PUBLIC_CONTACT_PHONE || '',
  whatsapp: webUrl(import.meta.env.PUBLIC_WHATSAPP_URL),
  messenger: webUrl(import.meta.env.PUBLIC_MESSENGER_URL),
};

export const callHref = site.bookingUrl || '/contact#strategy-call';
export const navigation = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Contact', href: '/contact' },
];
