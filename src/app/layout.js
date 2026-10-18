import { Familjen_Grotesk, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Cursor from "@/components/Cursor/Cursor";
import Header from "@/components/Header/Header";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import { offer, aud, siteUrl } from "@/content/site";
import "./globals.css";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-familjen",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const title = "Sangeethan — Custom Websites for Local Practices & Small Businesses";
const description = `Custom websites for local practices and small businesses — easy to find on Google, trusted at first glance and simple to book. ${offer.label}: websites ${aud(offer.website)}, Care Plan ${aud(offer.care)}/month for the first ${offer.careMonths} months.`;

/* Pages override title / description / alternates / openGraph.url;
   relative URLs resolve against metadataBase (siteUrl in content/site.js). */
export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Sangeethan",
    locale: "en_AU",
    title,
    description,
  },
};

export const viewport = {
  themeColor: "#050608",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="blueprint"
      className={`${familjen.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Cursor />
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
