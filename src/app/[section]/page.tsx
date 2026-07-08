import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/lib/nav";
import { IndexPage } from "@/components/templates";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ section: c.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const c = getCollection(section);
  if (!c) return {};
  return {
    title: c.label,
    description: c.intro,
    alternates: { canonical: `/${c.key}` },
    openGraph: { title: `${c.label} | ESGen`, description: c.intro },
  };
}

export default async function SectionIndex({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const c = getCollection(section);
  if (!c) notFound();
  return <IndexPage collection={c} />;
}
