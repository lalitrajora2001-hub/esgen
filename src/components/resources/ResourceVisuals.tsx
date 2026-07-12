"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const INK = "#101318";
const MUTED = "#565d68";

/* ============================================================
   GLOSSARY EXPLORER, search + A–Z rail + category filter.
   ============================================================ */
export type Term = { term: string; def: string; cat: "Carbon" | "Frameworks" | "Data" };

export function GlossaryExplorer({ terms }: { terms: Term[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [letter, setLetter] = useState<string | null>(null);

  const cats = ["All", "Carbon", "Frameworks", "Data"];
  const activeLetters = useMemo(() => new Set(terms.map((t) => t.term[0].toUpperCase())), [terms]);

  const filtered = useMemo(() => terms.filter((t) => {
    if (cat !== "All" && t.cat !== cat) return false;
    if (letter && t.term[0].toUpperCase() !== letter) return false;
    const s = q.trim().toLowerCase();
    if (s && !t.term.toLowerCase().includes(s) && !t.def.toLowerCase().includes(s)) return false;
    return true;
  }).sort((a, b) => a.term.localeCompare(b.term)), [terms, cat, letter, q]);

  return (
    <div>
      {/* controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e8ec] bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e6e8ec] bg-[#f6f7f9] px-3.5 py-2.5 focus-within:border-[#101318]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#565d68]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input value={q} onChange={(e) => { setQ(e.target.value); setLetter(null); }} placeholder="Search terms…" aria-label="Search glossary"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#101318] outline-none placeholder:text-[#565d68]" />
          {q && <button onClick={() => setQ("")} aria-label="Clear" className="text-[#565d68] hover:text-[#101318]">✕</button>}
        </div>
        <div className="flex gap-1 rounded-xl border border-[#e6e8ec] bg-[#f6f7f9] p-1">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className="relative rounded-lg px-3 py-1.5 text-[0.76rem] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#101318]"
              style={{ color: cat === c ? "#ffffff" : MUTED }}>
              {cat === c && <motion.span layoutId="catpill" className="absolute inset-0 rounded-lg" style={{ background: INK }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* A–Z rail */}
      <div className="mt-4 flex flex-wrap gap-1">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((L) => {
          const active = activeLetters.has(L);
          const on = letter === L;
          return (
            <button key={L} disabled={!active} onClick={() => setLetter(on ? null : L)} aria-pressed={on}
              className="grid h-7 w-7 place-items-center rounded-md text-[0.72rem] font-bold transition-colors disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#101318]"
              style={{ background: on ? INK : "transparent", color: on ? "#ffffff" : active ? INK : MUTED }}>{L}</button>
          );
        })}
        {(letter || cat !== "All" || q) && <button onClick={() => { setLetter(null); setCat("All"); setQ(""); }} className="ml-2 self-center text-[0.74rem] font-semibold text-[#101318] hover:underline">Reset</button>}
      </div>

      {/* results */}
      <div className="mt-6">
        <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-wide text-[#565d68]">{filtered.length} {filtered.length === 1 ? "term" : "terms"}</p>
        {filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((t) => (
              <motion.div key={t.term} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[#e6e8ec] bg-white p-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-[#101318]">{t.term}</h3>
                  <span className="rounded px-1.5 py-0.5 text-[0.56rem] font-bold uppercase tracking-wide" style={{ background: "#f0f1f4", color: MUTED }}>{t.cat}</span>
                </div>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-[#565d68]">{t.def}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e6e8ec] bg-white p-10 text-center">
            <p className="text-sm font-semibold text-[#101318]">No terms match “{q}”.</p>
            <button onClick={() => { setLetter(null); setCat("All"); setQ(""); }} className="mt-3 rounded-lg px-3 py-1.5 text-[0.78rem] font-bold text-white" style={{ background: INK }}>Reset filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   REGULATION EXPLORER, filter by jurisdiction; cards link out.
   ============================================================ */
export type Reg = { name: string; juris: "UK" | "EU" | "Global"; what: string; who: string; href: string };

export function RegulationExplorer({ regs }: { regs: Reg[] }) {
  const [juris, setJuris] = useState("All");
  const [sel, setSel] = useState(0);
  const tabs = ["All", "UK", "EU", "Global"];
  const filtered = regs.filter((r) => juris === "All" || r.juris === juris);
  const active = filtered[Math.min(sel, filtered.length - 1)] ?? filtered[0];
  const JCOLOR: Record<string, string> = { UK: "#101318", EU: "#565d68", Global: "#8a93a0" };

  return (
    <div>
      <div className="flex w-fit gap-1 rounded-xl border border-[#e6e8ec] bg-[#f6f7f9] p-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => { setJuris(t); setSel(0); }} aria-pressed={juris === t}
            className="relative rounded-lg px-4 py-2 text-[0.78rem] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#101318]"
            style={{ color: juris === t ? "#ffffff" : MUTED }}>
            {juris === t && <motion.span layoutId="jurispill" className="absolute inset-0 rounded-lg" style={{ background: INK }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-2">
          {filtered.map((r, i) => {
            const on = active?.name === r.name;
            return (
              <button key={r.name} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} aria-pressed={on}
                className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#101318]"
                style={{ borderColor: on ? "#101318" : "#e6e8ec", background: on ? "#f6f7f9" : "#ffffff" }}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-[0.6rem] font-bold text-white" style={{ background: JCOLOR[r.juris] }}>{r.juris}</span>
                <span className="min-w-0 flex-1"><span className="block font-display text-[0.92rem] font-semibold text-[#101318]">{r.name}</span></span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 transition-transform" style={{ color: on ? INK : MUTED, transform: on ? "translateX(2px)" : "none" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            );
          })}
        </div>

        {active && (
          <motion.div key={active.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}
            className="h-fit rounded-2xl border border-[#e6e8ec] bg-[#f6f7f9] p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[0.6rem] font-bold text-white" style={{ background: JCOLOR[active.juris] }}>{active.juris}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-[#101318]">{active.name}</h3>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-[#565d68]">{active.what}</p>
            <div className="mt-4 rounded-xl border border-[#e6e8ec] bg-white p-3.5">
              <div className="font-mono text-[0.6rem] uppercase tracking-wide text-[#565d68]">Who it affects</div>
              <p className="mt-1 text-[0.84rem] text-[#101318]">{active.who}</p>
            </div>
            <Link href={active.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#101318] hover:underline">
              How ESGen supports {active.name} <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
