import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, getLegal, LEGAL_UPDATED } from "@/lib/legal";
import { PageHero } from "@/components/sections/blocks";
import { Section } from "@/components/ui/Section";

export const dynamicParams = false;
export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegal(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.intro, alternates: { canonical: `/legal/${slug}` } };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegal(slug);
  if (!doc) notFound();
  return (
    <>
      <PageHero kicker="Legal" title={doc.title} intro={doc.intro} trail={[{ label: "Home", href: "/" }, { label: doc.title }]} secondary={{ label: "Contact", href: "/contact" }} />
      <Section className="section-blend">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 font-mono text-xs text-text-muted/60">Last updated: {LEGAL_UPDATED}</p>
          <div className="space-y-8">
            {doc.sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-xl font-semibold">{s.h}</h2>
                {s.p.map((para, i) => <p key={i} className="mt-3 text-text-muted">{para}</p>)}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
