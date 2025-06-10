import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Sangeethan",
  description: "Sangeethan's Portfolio",
};

export default function RootLayout({ children }) {
  return <html lang="en">{children}</html>;
}
