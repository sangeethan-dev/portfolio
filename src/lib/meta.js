/*
 * Per-page metadata with canonical + og:url. Paths are relative; layout.js
 * sets metadataBase from siteUrl, so switching domains is one change there.
 */
export function pageMeta({ title, description, path }) {
  return {
    title,
    description,
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
