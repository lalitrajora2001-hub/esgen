# Content placeholders to replace before launch

Everything below is a placeholder or an integration point. Replace each with real, verified
information. Nothing here has been invented as if it were true. British English, and please
keep the site free of em dashes.

## Brand and logo

- **Logo (done).** The real traced ESGEN wordmark is now installed at
  `public/brand/esgen-logo.svg` (viewBox 0 0 2826 810), and the collapsed E at
  `public/brand/esgen-symbol.svg` (derived from the wordmark). Both are rendered white via a
  CSS mask in `src/components/logo/Logo.tsx`. The header collapses the wordmark to the E on
  scroll. If you re-export the artwork, replace those two files in place.
  - Optional: regenerate `public/brand/og-image.svg` and the favicon from the final artwork.

## Photography (stock, replace with your own)

- All photos are **stock images from Unsplash**, referenced by URL in `src/lib/images.ts`.
  They are placeholders in the style we want (modern offices, teams, industry, renewables).
  Replace them with ESGen's own photography before launch by editing the URLs (or the `alt`
  text) in `src/lib/images.ts`. Photos appear on: the homepage hero, the shared page-template
  hero (industry, solution, platform, compliance, and section index pages), and the Company
  and Customers pages. All use lazy loading and descriptive alt text.

## Company facts

- Registered company name, number, and registered office address. See the footer
  (`src/components/layout/Footer.tsx`) and the contact page.
- Phone number (not currently shown; add if wanted) and full postal address on
  `src/app/contact/page.tsx`.
- Confirm the contact email. Currently `info@esgen.co.uk` (set in `src/lib/nav.ts`).
- Set the live domain in `src/lib/nav.ts` (`site.url`) so canonical URLs, the sitemap, and
  robots.txt are correct.

## Statistics and metrics

- Homepage stats band (`src/app/page.tsx`): the "60% less time" and "100% audit trail"
  figures are marked `[verify]`. Replace with verified numbers or remove.
- Solution template outcomes strip (`src/components/templates/index.tsx`): three `[verify]`
  metrics per solution page.

## Testimonials, customers, case studies

- Homepage testimonials are structure only: `[name]`, `[role, company]`, `[testimonial quote]`.
- Trust bar uses neutral "Client logo" slots. Do not add real names or logos without permission.
- Industry pages include a `[case study placeholder]`.
- The Customers section (`/customers/*`) uses clearly marked sample cards.

## Team and people

- Company pages (`/company/*`) include a `[team member placeholders]` block. Add real names,
  roles, and photos.

## Pricing

- `src/app/pricing/page.tsx`: prices and user limits are `[price]` and `[n]` placeholders.
  Replace with confirmed figures. The ROI calculator is an illustrative estimate only.

## Legal pages

- All `/legal/*` pages use standard placeholder wording and a visible "legal review required"
  note. Have a qualified adviser review and replace before publishing. Add real "last updated"
  dates.

## Listings (blog, resources, events, careers, press)

- These use 6 sample cards each, clearly labelled as samples. Replace with real entries, or
  wire to a CMS.

## Forms and interactive UI (integration points)

- Contact form (`src/components/forms/ContactForm.tsx`): wire submission to your email
  provider or CRM.
- Demo booking (`src/components/forms/DemoForm.tsx`): connect a real scheduling tool. The
  time slots are illustrative.
- Login (`src/components/forms/LoginForm.tsx`): UI only. Connect your identity provider.
- Newsletter (`src/components/layout/NewsletterForm.tsx`): wire to your email provider.

## Compliance pages (keep accurate)

- The compliance content in `src/lib/compliance.ts` was reviewed for accuracy in early 2026
  and each page shows a "last reviewed" note. Regulations change often. Review before relying
  on any page, and update the reviewed date when you do.

## Charts

- All figures in charts are illustrative sample data and labelled as such. Replace with real,
  clearly sourced data if you present customer results.
