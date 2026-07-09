import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pagesIn, getPage } from "@/lib/content";
import { ContentPage } from "@/components/templates/ContentPage";

export const dynamicParams = false;
// Slugs with a bespoke page under /platform/<slug>/page.tsx take precedence.
const CUSTOM = new Set(["carbon-assessment", "suppliers-engagement", "decarbonization-strategy", "emissions-factors", "lca"]);
export function generateStaticParams() {
  return pagesIn("platform").filter((p) => !CUSTOM.has(p.slug)).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage("platform", slug);
  if (!page) return {};
  return { title: page.seoTitle, description: page.seoDescription, alternates: { canonical: `/platform/${slug}` }, openGraph: { title: `${page.seoTitle} | ESGen`, description: page.seoDescription } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage("platform", slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
