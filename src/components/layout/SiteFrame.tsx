"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Chooses the page frame based on the route. The marketing site keeps its
 * Lenis smooth-scroll + Header + Footer. The tool at /app renders bare (no
 * marketing chrome, no smooth-scroll hijack) and supplies its own app shell.
 */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname === "/app" || pathname?.startsWith("/app/");

  if (isApp) {
    return <main id="main">{children}</main>;
  }

  return (
    <SmoothScroll>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
