import { Unbounded, Inter_Tight, JetBrains_Mono } from "next/font/google";
import Cursor from "@/components/Cursor/Cursor";
import Header from "@/components/Header/Header";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import { offer, aud } from "@/content/site";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-unbounded",
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

export const metadata = {
  title: "Sangeethan — Custom Websites for Local Practices & Small Businesses",
  description: `Custom websites for local practices and small businesses — easy to find on Google, trusted at first glance and simple to book. ${offer.label}: websites ${aud(offer.website)}, Care Plan ${aud(offer.care)}/month for the first ${offer.careMonths} months.`,
};

export const viewport = {
  themeColor: "#0E1A2B",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="blueprint"
      className={`${unbounded.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Cursor />
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
