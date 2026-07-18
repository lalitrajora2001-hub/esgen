import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/nav";
import { SiteFrame } from "@/components/layout/SiteFrame";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600", "700"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Next-Generation ESG Reporting Built for the Future",
    template: "%s | ESGen",
  },
  description: site.description,
  applicationName: "ESGen",
  verification: { google: "U2k5d5NZTTlDwlng7k7Yi22aASNzXkvx1_UVXIjTRWU" },
  keywords: [
    "carbon accounting software",
    "ESG reporting software",
    "GHG accounting",
    "ESG data management",
    "CSRD",
    "CBAM",
    "UK SRS",
    "SECR",
    "supplier assessment",
    "double materiality",
  ],
  openGraph: {
    type: "website",
    siteName: "ESGen",
    title: "Next-Generation ESG Reporting Built for the Future",
    description: site.description,
    url: site.url,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "ESGen, next-generation ESG reporting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next-Generation ESG Reporting Built for the Future",
    description: site.description,
    images: ["/brand/og-image.png"],
  },
};

/* Organization structured data, what Google uses to associate a brand logo
   with the site. Verifiable facts only: no invented address or socials. */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ESGen",
  url: site.url,
  logo: `${site.url}/brand/esgen-logo-mark.png`,
  email: site.emails.general,
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${sora.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300]"
        >
          Skip to content
        </a>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
