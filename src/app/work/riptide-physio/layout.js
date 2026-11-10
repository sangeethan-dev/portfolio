import { Antonio, Instrument_Serif, Manrope } from "next/font/google";
import styles from "@/components/Riptide/Riptide.module.css";

/* Riptide's own type: condensed editorial display, a serif for accents,
   and a clean grotesk for reading. Nothing from the portfolio theme. */
const display = Antonio({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-rt-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-rt-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rt-sans",
  display: "swap",
});

const title = "Riptide Physio & Performance | Physiotherapy in Mermaid Beach, Gold Coast";
const description =
  "Sports and everyday physiotherapy in Mermaid Beach. No referral needed, HICAPS on the spot, open from 6am and Saturdays. Book online.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/work/riptide-physio" },
  // Concept build: keep it out of search so nobody looking for a real
  // physio in Mermaid Beach lands here.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "/work/riptide-physio",
    siteName: "Riptide Physio & Performance",
    locale: "en_AU",
    title,
    description,
    images: [{ url: "/riptide/og.jpg", width: 1200, height: 630 }],
  },
};

export const viewport = {
  themeColor: "#04070d",
};

export default function RiptideLayout({ children }) {
  return (
    <div
      data-riptide
      className={`${styles.root} ${display.variable} ${serif.variable} ${sans.variable}`}
    >
      {children}
    </div>
  );
}
