import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/lib/nav";
import { getCompliance } from "@/lib/compliance";
import { TemplatePage } from "@/components/templates";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.flatMap((c) => c.items.map((it) => ({ section: c.key, slug: it.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  const c = getCollection(section);
  const item = c?.items.find((i) => i.slug === slug);
  if (!c || !item) return {};
  const compliance = section === "compliance" ? getCompliance(slug) : undefined;
  const description = compliance?.summary ?? item.desc;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/${c.key}/${slug}` },
    openGraph: { title: `${item.title} | ESGen`, description },
  };
}

export default async function CollectionItem({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const c = getCollection(section);
  const item = c?.items.find((i) => i.slug === slug);
  if (!c || !item) notFound();
  return <TemplatePage collection={c} item={item} />;
}
