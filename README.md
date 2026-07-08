# ESGen website

Production-ready marketing site for ESGen, a carbon accounting and ESG software company.
Dark, layered, GitHub-inspired theme in the ESGen brand blue. Built as a static-exportable
Next.js app so it can host for free on Netlify, Cloudflare Pages, or Vercel.

## Tech stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (tokens defined in `src/app/globals.css` via `@theme`)
- Framer Motion (reveals, dropdowns, logo scroll transition, counters)
- GSAP (available for pinned scroll storytelling)
- Lenis (smooth momentum scrolling, disabled under reduced motion)
- Recharts (accessible, animated charts)
- next/font (self-hosted Sora, Inter, and Michroma)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build a static export

```bash
npm run build      # outputs a fully static site to ./out
```

`next.config.ts` sets `output: "export"`, so `npm run build` writes plain HTML, CSS, and JS
to `out/`. There is no server to run. Preview the export with any static file server, for
example:

```bash
npx serve out
```

## Deploy

The `out` folder is a complete static site. Any of the following work.

### Netlify
- Build command: `npm run build`
- Publish directory: `out`
- Or drag and drop the `out` folder into the Netlify dashboard.

### Cloudflare Pages
- Framework preset: Next.js (Static HTML Export), or None.
- Build command: `npm run build`
- Build output directory: `out`

### Vercel
- Import the repo. Vercel detects Next.js automatically.
- Because `output: "export"` is set, it is deployed as a static site.
- Build command: `npm run build`, output directory: `out` (Vercel handles this by default).

## Project structure

```
src/
  app/
    layout.tsx              Root layout: fonts, metadata, Lenis, Header, Footer
    page.tsx                Homepage (full section flow)
    [section]/page.tsx      Section index pages (Platform, Compliance, etc.)
    [section]/[slug]/page.tsx  Every Appendix A sub-page, generated from data
    pricing / contact / demo / login   Utility pages
    sitemap.ts, robots.ts   SEO
  components/
    layout/   Header (scroll logo transition, mega-menu), MobileDrawer, Footer, SmoothScroll
    logo/     Wordmark and Symbol
    ui/       Button, Section, Reveal, StatCounter, FAQ
    charts/   Recharts components + Scope 1/2/3 diagram
    sections/ Hero (cursor-reactive)
    templates/  The eight page templates + shared building blocks
    forms/    Contact, Demo, Login (client-side validation only)
    pricing/  ROI calculator
  lib/
    nav.ts        Navigation, footer, and the full route manifest (one source of truth)
    compliance.ts Accurate framework reference (source of truth for compliance pages)
    cn.ts         Class name helper
public/
  brand/    Logo SVGs, favicon, OG image
  images/   Image slots (see images/README.md)
```

## How pages are generated

Every route in the manifest lives in `src/lib/nav.ts` as a collection of items, each with a
`template` type. The dynamic routes read that data and render one of eight templates
(`src/components/templates`). To add or edit a page, edit the data in `nav.ts` (and, for
compliance pages, `compliance.ts`). This keeps 180+ pages consistent.

## Defaults chosen (noted per the brief)

- Next.js over Astro, for the interaction set and component model requested.
- Tailwind v4 with CSS-based tokens (the current default in create-next-app).
- The ESGEN wordmark is rendered in the geometric Michroma face as a faithful, accessible
  stand-in. Replace with the real vector when available (see `content-placeholders.md`).
- Charts use illustrative sample data, labelled as such.
- Forms validate on the client but do not submit anywhere. Integration points are marked.

## Content to replace before launch

See `content-placeholders.md` for every placeholder (stats, testimonials, client logos,
prices, team, address, company number, and the real logo vector) and `public/images/README.md`
for the image slots.

## Accessibility and performance notes

- Semantic HTML, labelled controls, keyboard-operable menus, visible focus states.
- Every animation honours `prefers-reduced-motion` (Lenis, reveals, counters, hero glow).
- Static export means fast first load. Charts and heavy client components are isolated.
- British English throughout. No em dashes anywhere.
