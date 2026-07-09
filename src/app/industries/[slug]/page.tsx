import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pagesIn, getPage } from "@/lib/content";
import { ContentPage } from "@/components/templates/ContentPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return pagesIn("industries").map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage("industries", slug);
  if (!page) return {};
  return { title: page.seoTitle, description: page.seoDescription, alternates: { canonical: `/industries/${slug}` }, openGraph: { title: `${page.seoTitle} | ESGen`, description: page.seoDescription } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage("industries", slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
