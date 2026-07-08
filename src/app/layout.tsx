import type { Metadata } from "next";
import { Sora, Inter, Michroma } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/nav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600", "700"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const michroma = Michroma({ subsets: ["latin"], variable: "--font-michroma", weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ESGen | Carbon accounting and ESG software",
    template: "%s | ESGen",
  },
  description: site.description,
  applicationName: "ESGen",
  keywords: ["carbon accounting", "ESG software", "CSRD", "GHG Protocol", "emissions reporting", "Scope 3", "net zero"],
  icons: {
    icon: [{ url: "/brand/esgen-symbol.svg", type: "image/svg+xml" }],
    shortcut: "/brand/esgen-symbol.svg",
    apple: "/brand/esgen-symbol.svg",
  },
  openGraph: {
    type: "website",
    siteName: "ESGen",
    title: "ESGen | Carbon accounting and ESG software",
    description: site.description,
    url: site.url,
    images: [{ url: "/brand/og-image.svg", width: 1200, height: 630, alt: "ESGen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESGen | Carbon accounting and ESG software",
    description: site.description,
    images: ["/brand/og-image.svg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${sora.variable} ${inter.variable} ${michroma.variable} antialiased`}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:text-white">
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
