/*
 * Per-page metadata with canonical + og:url. Paths are relative; layout.js
 * sets metadataBase from siteUrl, so switching domains is one change there.
 * noindex: keep the page out of search results (it can still be crawled,
 * so search engines see the tag; links on it are still followed).
 */
export function pageMeta({ title, description, path, noindex = false }) {
  return {
    title,
    description,
    ...(noindex && { robots: { index: false, follow: true } }),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Sangeethan",
      locale: "en_AU",
      url: path,
      title,
      description,
    },
  };
}
