import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';
import { SERVICES } from '@/data/services';
import { DESTINATIONS } from '@/data/destinations';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/services/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/destinations/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE.url}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE.url}/plan-your-journey/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE.url}/services/${service.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = DESTINATIONS.map((dest) => ({
    url: `${SITE.url}/destinations/${dest.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...coreRoutes, ...serviceRoutes, ...destinationRoutes];
}
