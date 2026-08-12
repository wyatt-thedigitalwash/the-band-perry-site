import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

/**
 * Every indexable route on the site. The /legal pages are deliberately absent:
 * they each carry `robots: { index: false }`, and listing a noindex URL in the
 * sitemap sends search engines two contradictory signals. Add a page here the
 * moment it becomes indexable.
 */
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/tour', changeFrequency: 'daily', priority: 0.9 },
  { path: '/music', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/videos', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/band', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
    lastModified,
  }));
}
