import type { MetadataRoute } from "next";
import { site, resources } from "@/lib/nav";
import { ALL_PAGES } from "@/lib/content";
import { legalDocs } from "@/lib/legal";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const routes: string[] = [
    "/", "/pricing", "/contact", "/demo", "/login", "/partner-program",
    ...ALL_PAGES.map((p) => `/${p.collection}/${p.slug}`),
    ...resources.map((r) => r.href),
    ...legalDocs.map((d) => `/legal/${d.slug}`),
  ];
  return Array.from(new Set(routes)).map((r) => ({
    url: `${base}${r}/`.replace(/\/\/$/, "/"),
    changeFrequency: "monthly",
    priority: r === "/" ? 1 : 0.6,
  }));
}
