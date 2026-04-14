import { INSTRUMENTS } from '@/data/instruments';

const BASE_URL = 'https://arpelio.com';

export default function sitemap() {
  const instrumentPages = INSTRUMENTS.filter(i => !i.hidden).map(inst => ({
    url: `${BASE_URL}/instruments/${inst.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/instruments`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/builder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...instrumentPages,
  ];
}
