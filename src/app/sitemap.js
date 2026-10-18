import { siteUrl } from "@/content/site";

/* /sitemap.xml — the real pages only (the demo routes are left out) */
export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/agencies`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
