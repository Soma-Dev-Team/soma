import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soma.app';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/about`, lastModified: now, priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.5 },
    { url: `${base}/terms`, lastModified: now, priority: 0.5 },
    { url: `${base}/login`, lastModified: now, priority: 0.6 },
  ];
}
