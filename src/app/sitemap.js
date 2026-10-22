import { siteUrl } from "@/content/site";

/* /sitemap.xml — the public pages only. The demo routes and /agencies
   (noindex, shared directly in agency outreach) are left out. */
export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
