# Image slots

The site currently uses SVG and HTML dashboard mockups plus CSS gradient placeholders instead
of photography, so it looks clean out of the box and has no licensing questions. When you are
ready to add real imagery, download high-resolution photos into this folder and reference them
locally with `next/image`. Do not hotlink.

Suggested sources: your own photography first, then Unsplash (the Unsplash licence covers this
use) for renewable energy, industrial, sustainability, nature, dashboard, and team imagery.

Keep all alt text plain and free of em dashes.

## Slots to fill

| Slot | Where it is used | Suggested image |
| --- | --- | --- |
| `hero-product.*` | Homepage hero visual (currently an HTML mockup) | A clean product screenshot once available |
| `industry-*.jpg` | Industry pages hero and header (currently gradient) | Sector photography per industry |
| `article-*.jpg` | Knowledge and resource cards (currently gradient) | Relevant editorial imagery |
| `team-*.jpg` | Company and leadership pages | Real team headshots |
| `customer-logo-*.svg` | Homepage trust bar and Customers pages | Real customer logos, with permission only |
| `og-image.png` | Social sharing (currently `public/brand/og-image.svg`) | Branded 1200 x 630 image |

## How to use once added

```tsx
import Image from "next/image";

<Image
  src="/images/industry-manufacturing.jpg"
  alt="Manufacturing facility with rooftop solar"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"          // add blurDataURL, or use a static import for automatic blur
/>
```

Because the site is a static export, `next.config.ts` sets `images.unoptimized = true`. Export
images at the sizes you need, or add a build-time image step if you want responsive variants.
