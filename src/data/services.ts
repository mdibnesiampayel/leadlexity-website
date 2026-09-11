export interface Service {
  id: string;
  name: string;
  interest: string;
  icon: string;
  category: string;
  description: string;
  introduction: string;
  why: string;
  deliverables: string[];
  suited: string;
  focus: string;
}

export const services: Service[] = [
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    interest: 'Meta Ads',
    icon: 'megaphone',
    category: 'PAID SOCIAL',
    description:
      'Performance-driven advertising across Facebook and Instagram, designed to reach the right audience and generate qualified leads.',
    introduction:
      'Put your business in front of the people who are most likely to need it. We connect audience insight, compelling creative, and purposeful campaigns across Facebook and Instagram.',
    why: 'Attention is valuable only when it comes from the right people. A thoughtful paid social strategy helps you move beyond boosted posts and build a clearer path from discovery to enquiry.',
    deliverables: [
      'Audience research and campaign strategy',
      'Campaign setup and account structure',
      'Ad concepts, creative direction, and copy',
      'Conversion tracking planning and implementation',
      'Ongoing testing, optimization, and clear reporting',
    ],
    suited:
      'Local and service-based businesses looking to reach new audiences, communicate their value, and create a consistent source of relevant enquiries.',
    focus: 'The right message. The right audience.',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    interest: 'Google Ads',
    icon: 'target',
    category: 'PAID SEARCH',
    description:
      'Capture high-intent demand with carefully structured Google campaigns focused on measurable business outcomes.',
    introduction:
      'Be there when potential customers are actively searching. We build focused Google Ads campaigns around the services you offer and the searches that signal genuine intent.',
    why: 'Not every click is an opportunity. The right keywords, clear messaging, and a relevant landing experience work together to make your advertising budget more purposeful.',
    deliverables: [
      'Search intent and keyword research',
      'Campaign structure and location targeting',
      'Search ad copy and relevant assets',
      'Conversion tracking and landing page alignment',
      'Search term reviews, bid optimization, and reporting',
    ],
    suited:
      'Service providers with a clear offering who want to connect with customers already looking for a solution, locally or across their service area.',
    focus: 'Meet demand at the moment it matters.',
  },
  {
    id: 'website-development',
    name: 'Website Development',
    interest: 'Website Development',
    icon: 'monitor',
    category: 'DIGITAL EXPERIENCES',
    description:
      'Fast, modern, and conversion-focused websites designed to turn visitors into potential customers.',
    introduction:
      'Give your business a digital home that works as well as it looks. We build responsive websites that make your offer clear, establish credibility, and help visitors take the next step.',
    why: 'Your website connects every part of your marketing. Slow pages, unclear messaging, and a confusing experience can get in the way of an otherwise strong offer.',
    deliverables: [
      'Website strategy and information architecture',
      'Responsive, brand-aligned UI design',
      'Fast, accessible front-end development',
      'Clear enquiry paths and form integration',
      'Technical SEO foundations and launch checks',
    ],
    suited:
      'Businesses building their first serious website or replacing an existing site that no longer reflects their brand, services, or growth ambitions.',
    focus: 'A stronger foundation for everything next.',
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    interest: 'Landing Page',
    icon: 'panel',
    category: 'CONVERSION EXPERIENCES',
    description:
      'Purpose-built landing pages designed around a single goal: turning targeted traffic into action.',
    introduction:
      'Give every campaign a focused destination. We design and develop landing pages that connect the promise in your advertising to one clear, useful action.',
    why: 'Sending every visitor to a general homepage can dilute intent. A dedicated page removes distractions, answers important questions, and makes the next step obvious.',
    deliverables: [
      'Offer, audience, and conversion goal alignment',
      'Conversion-focused page structure and copy',
      'Responsive design and fast development',
      'Lead form or booking integration',
      'Measurement setup and iteration planning',
    ],
    suited:
      'Businesses running paid campaigns, launching a specific service, or testing a new offer that needs a dedicated lead-generation experience.',
    focus: 'One page. One purpose. A clearer next step.',
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    interest: 'Social Media Management',
    icon: 'message-square',
    category: 'BRAND & CONTENT',
    description:
      'Consistent, strategic social media that builds credibility, keeps your brand active, and supports business growth.',
    introduction:
      'Show up with intention, not just frequency. We give your social presence a clear direction through relevant content, consistent design, and a plan tied to your business.',
    why: 'People often look at your social channels before they get in touch. An active, thoughtful presence helps them understand what you do and why your business is worth considering.',
    deliverables: [
      'Social channel review and content strategy',
      'Content themes and editorial calendars',
      'Branded creative and purposeful copywriting',
      'Publishing and community response guidance',
      'Content performance reviews and refinement',
    ],
    suited:
      'Service businesses that need a consistent, credible brand presence but do not have the time or in-house resources to manage it thoughtfully.',
    focus: 'Build a presence with a purpose.',
  },
  {
    id: 'seo',
    name: 'SEO',
    interest: 'SEO',
    icon: 'search',
    category: 'ORGANIC GROWTH',
    description:
      'Build sustainable organic visibility and help potential customers discover your business when it matters.',
    introduction:
      'Make your business easier to find and your expertise easier to understand. We approach SEO as a long-term investment in useful content, technical quality, and search relevance.',
    why: 'Customers are searching for answers before they are ready to enquire. Clear, useful pages and a technically sound website help your business become part of that journey. Organic growth takes sustained work—not ranking guarantees.',
    deliverables: [
      'Technical and on-page SEO review',
      'Keyword research and search intent mapping',
      'Service page and content optimization',
      'Local search and Google Business Profile guidance',
      'Organic performance monitoring and prioritization',
    ],
    suited:
      'Local and service-based businesses ready to invest in their digital foundations and build a more sustainable source of relevant organic traffic.',
    focus: 'Be discoverable. Stay relevant.',
  },
];
