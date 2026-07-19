# AGENTS.md — Harmonia Progres

## Project

NGO website for Manakara (Madagascar) supporting local entrepreneurship. Targets young entrepreneurs, artisans, fishermen, investors, NGOs, and international organizations. Must look like a $10K+ agency build.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| SEO | Next.js Metadata API + JSON-LD |
| Forms | React Hook Form + Zod |
| State | Zustand |
| HTTP | Axios |
| Carousel | Swiper |
| Maps | Leaflet |
| Charts | Recharts |
| Notifications | Sonner |
| Utilities | clsx, tailwind-merge |
| Deploy | Vercel |

## Commands

```bash
npm install          # install deps
npm run dev          # start dev server
npm run build        # production build
npm run start        # start production server
npm run lint         # ESLint check
```

Typecheck: `tsc --noEmit` (no separate script — run directly).

**Required verification order:** lint → typecheck → build.

## Folder Structure

```
src/
  app/                # App Router pages and layouts
    layout.tsx        # Root layout
    page.tsx          # Homepage
    about/            # About page
    programs/         # Programs page
    news/             # News page
    events/           # Events page
    gallery/          # Gallery page
    partners/         # Partners page
    testimonials/     # Testimonials page
    faq/              # FAQ page
    contact/          # Contact page
    donate/           # Donate page
  components/
    layout/           # Header, Footer, Navigation
    sections/         # Homepage sections (Hero, Programs, Stats...)
    ui/               # Reusable primitives (Button, Card, Badge...)
  hooks/              # Custom hooks
  store/              # Zustand stores
  services/           # API layer
  types/              # Shared TypeScript types
  utils/              # Helpers
  constants/          # Static data / config
  seo/                # SEO helpers, structured data
  config/             # App config
  assets/             # Images, fonts
```

## Design System

| Token | Value |
|---|---|
| Primary | `#0F766E` |
| Secondary | `#14B8A6` |
| Accent | `#F97316` |
| Background | `#FAFAF8` |
| Surface | `#FFFFFF` |
| Text | `#0F172A` |
| Secondary Text | `#64748B` |

Fonts: **Plus Jakarta Sans** (headings), **Inter** (body).

Design inspiration: Stripe, Linear, Apple, Framer, Patagonia. Glassmorphism (subtle), large spacing, soft shadows, smooth Framer Motion animations.

## Conventions

- Functional components only, strong typing, no `any`.
- No inline styles — Tailwind classes only.
- No duplicated logic — extract to hooks or utils.
- Every component must handle hover, focus, loading, and responsive states.
- Animations via Framer Motion: fade, slide, scale, scroll-reveal, hover elevation.
- Mobile-first responsive: 320px → 1920px.
- WCAG 2.2: keyboard nav, ARIA labels, semantic HTML, heading hierarchy, contrast.

## SEO Requirements

Every page needs: unique title, meta description, canonical URL, Open Graph, Twitter Card, JSON-LD structured data, breadcrumb nav, semantic HTML. Maintain `robots.txt` and `sitemap.xml`.

Use Next.js `Metadata` export from `next` for page-level SEO. Use `generateMetadata()` for dynamic pages.

## Pages

Homepage, About (Mission/Vision/Objectives), Programs (Training/Assistance/Financing/Networking), News, Events, Gallery, Partners, Testimonials, FAQ, Contact, Donate.

## Gotchas

- Tailwind v4 config differs from v3 — no `tailwind.config.js`; uses CSS-based config (`@theme` directive).
- Use `"use client"` directive for client components (Framer Motion, interactive UI).
- Sonner for toast notifications, not react-toastify.
- No snapshot testing — this is a static informational site, not a library.
- Server Components are the default — only add `"use client"` when needed (animations, event handlers, browser APIs).
- Turbopack is NOT supported on this platform (win32/x64) — native SWC bindings fail. Use `next dev --webpack` and `next build --webpack` (already set in `package.json` scripts).

## Full Spec

For complete design specs, color palette, typography, component rules, and page-by-page requirements, refer to the project README or ask the user for the full specification document.
