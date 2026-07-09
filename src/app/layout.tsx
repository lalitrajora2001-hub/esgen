import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/nav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600", "700"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Carbon Accounting and ESG Reporting Software | ESGen",
    template: "%s | ESGen",
  },
  description:
    "ESGen helps businesses collect sustainability data, calculate emissions, prepare reporting evidence, and turn ESG information into practical decisions.",
  applicationName: "ESGen",
  keywords: [
    "carbon accounting software",
    "ESG reporting software",
    "GHG accounting",
    "ESG data management",
    "CSRD",
    "CBAM",
    "BRSR",
    "supplier assessment",
    "double materiality",
  ],
  openGraph: {
    type: "website",
    siteName: "ESGen",
    title: "Carbon Accounting and ESG Reporting Software | ESGen",
    description:
      "Collect sustainability data, calculate emissions, and prepare reporting evidence in one guided ESG workspace.",
    url: site.url,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${sora.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300]"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
