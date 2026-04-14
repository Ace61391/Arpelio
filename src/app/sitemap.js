import { INSTRUMENTS } from '@/data/instruments';

const BASE_URL = 'https://arpelio.com';

export default function sitemap() {
  const instrumentPages = INSTRUMENTS.filter(i => !i.hidden).map(inst => ({
    url: `${BASE_URL}/instruments/${inst.id}`,
    lastModified: '2026-04-14',
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: '2026-04-14',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/instruments`,
      lastModified: '2026-04-14',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/builder`,
      lastModified: '2026-04-14',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: '2026-04-14',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: '2026-04-14',
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    ...instrumentPages,
  ];
}
