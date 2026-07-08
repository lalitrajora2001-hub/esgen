import type { MetadataRoute } from "next";
import { collections, site } from "@/lib/nav";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = ["", "/pricing", "/contact", "/demo", "/login"];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r}/`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));

  for (const c of collections) {
    entries.push({ url: `${base}${c.base}/`, changeFrequency: "monthly", priority: 0.6 });
    for (const it of c.items) {
      entries.push({ url: `${base}${c.base}/${it.slug}/`, changeFrequency: "monthly", priority: 0.5 });
    }
  }

  return entries;
}
