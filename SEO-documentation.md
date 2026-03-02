# Gala & Co — SEO Implementation Documentation

**Prepared for:** SEO Team
**Website:** [galaandco.com](https://www.galaandco.com)
**Date:** February 2026
**Document covers:** All on-page SEO, technical SEO, structured data, performance, and accessibility implementations across the four-page static website.

---

## 1. Architecture — Why It Matters for SEO

The site was **converted from a JavaScript Single Page Application (SPA)** to a fully static, multi-page HTML site. This is the most impactful SEO change made.

| Before | After |
|---|---|
| React SPA — content rendered client-side by JS | Static HTML — all content in the raw HTML source |
| Single `index.html`, one shared `<title>` | 4 separate `.html` files, each with unique metadata |
| Googlebot had to execute JS to see content | Googlebot reads content instantly, no JS required |
| No `sitemap.xml` | `sitemap.xml` listing all 4 URLs |
| No `robots.txt` | `robots.txt` present |

> **Impact:** Full and immediate crawl visibility for every word, heading, image, and link on the site.

---

## 2. Page Inventory

| Page | URL | File |
|---|---|---|
| Home | `https://www.galaandco.com/` | `index.html` |
| About | `https://www.galaandco.com/about.html` | `about.html` |
| Services | `https://www.galaandco.com/services.html` | `services.html` |
| Contact | `https://www.galaandco.com/contact.html` | `contact.html` |

---

## 3. On-Page SEO — Per Page

### 3.1 `index.html` — Home Page

```html
<title>Gala & Co | Luxury Real Estate Advisory & Contracting Mumbai</title>
<meta name="description" content="Gala & Co delivers premium real estate advisory and world-class contracting in Mumbai. 50+ landmark projects, 12 years of excellence. Shaping spaces that reflect you." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://www.galaandco.com/" />
```

**H1:** `Shaping Spaces That Reflect You`
**H2s:** `We Don't Build Properties. We Build Legacy.` / `Two Pillars. One Standard.` / `Crafted With Conviction.` / `Let's Create Something Extraordinary.`
**H3s:** `Real Estate Advisory` / `Contracting` / (4× project titles)

---

### 3.2 `about.html` — About Page

```html
<title>About Gala & Co | A Decade of Real Estate Excellence in Mumbai</title>
<meta name="description" content="Learn about Gala & Co — 12+ years of premium real estate advisory and contracting in Mumbai. Meet the team behind 50+ landmark projects built with precision and purpose." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://www.galaandco.com/about.html" />
```

**H1:** `About Gala & Co`
**H2s:** `We Don't Build Properties. We Build Legacy.` / `Our Values.` and more.

---

### 3.3 `services.html` — Services Page

```html
<title>Services | Real Estate Advisory & Contracting — Gala & Co</title>
<meta name="description" content="Gala & Co offers premium real estate advisory and end-to-end contracting services in Mumbai. From investment strategy to luxury construction — two pillars, one standard of excellence." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://www.galaandco.com/services.html" />
```

**H1:** `Two Pillars. One Standard.`
**H2s:** `Real Estate Advisory` (with `id="advisory-heading"`) / `Contracting` (with `id="contracting-heading"`)

---

### 3.4 `contact.html` — Contact Page

```html
<title>Contact Gala & Co | Start Your Real Estate Journey in Mumbai</title>
<meta name="description" content="Get in touch with Gala & Co — Mumbai's trusted real estate advisory and contracting firm. Visit us at Lower Parel or call +91 98765 43210. Let's create something extraordinary together." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://www.galaandco.com/contact.html" />
```

**H1:** `Contact Gala & Co`

---

## 4. Open Graph (Social Sharing) Tags

Implemented on all 4 pages. Enables rich previews when shared on LinkedIn, WhatsApp, Facebook, etc.

```html
<!-- Example from index.html -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Gala & Co | Luxury Real Estate Advisory & Contracting Mumbai" />
<meta property="og:description" content="Gala & Co delivers premium real estate advisory and world-class contracting in Mumbai. 50+ landmark projects, 12 years of excellence." />
<meta property="og:url" content="https://www.galaandco.com/" />
<meta property="og:image" content="https://www.galaandco.com/assets/images/hero-building.jpg" />
```

Each page has a **unique OG image** pointing to the most relevant imagery for that page.

| Page | OG Image |
|---|---|
| Home | `hero-building.jpg` |
| About | `lifestyle-interior.jpg` |
| Services | `project-commercial.jpg` |
| Contact | `hero-building.jpg` |

---

## 5. Structured Data (JSON-LD Schema Markup)

All schema uses `@context: https://schema.org`. Validated against [Google's Rich Results Test](https://search.google.com/test/rich-results).

### 5.1 `RealEstateAgent` — All 4 Pages

Present on **every** page as the core entity definition.

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Gala & Co",
  "description": "Premium real estate advisory and contracting services in Mumbai, India.",
  "url": "https://www.galaandco.com/",
  "telephone": "+91-98765-43210",
  "email": "connect@galaandco.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "42 Victoria Tower, Lower Parel",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400013",
    "addressCountry": "IN"
  },
  "foundingDate": "2014",
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": "50" }
}
```

Enhanced version on `index.html` additionally includes:
- `areaServed: "Mumbai"`
- `sameAs` array linking to Instagram and LinkedIn profiles

---

### 5.2 `WebSite` Schema — `index.html` only

Helps Google understand the site entity and enables sitelinks search box in the future.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Gala & Co",
  "url": "https://www.galaandco.com/",
  "description": "Luxury Real Estate Advisory & Contracting — Shaping Spaces That Reflect You",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.galaandco.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

### 5.3 `Service` Schema — `services.html` (×2)

Two separate `Service` schema blocks — one per service line — with full `OfferCatalog` listings.

**Service 1: Real Estate Advisory**
```json
{
  "@type": "Service",
  "serviceType": "Real Estate Advisory",
  "name": "Real Estate Advisory",
  "description": "Strategic guidance for investors, developers, and individuals seeking premium real estate opportunities...",
  "provider": { "@type": "RealEstateAgent", "name": "Gala & Co", "url": "https://www.galaandco.com/" },
  "areaServed": { "@type": "City", "name": "Mumbai" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Advisory Services",
    "itemListElement": [
      { "name": "Market Intelligence" },
      { "name": "Investment Strategy" },
      { "name": "Portfolio Advisory" },
      { "name": "Due Diligence" }
    ]
  }
}
```

**Service 2: Contracting**
```json
{
  "@type": "Service",
  "serviceType": "Construction & Contracting",
  "name": "Contracting",
  "hasOfferCatalog": {
    "itemListElement": [
      "Luxury Residential", "Commercial Spaces", "Interior Fit-outs", "Project Management"
    ]
  }
}
```

---

### 5.4 `ContactPage` Schema — `contact.html`

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Gala & Co",
  "url": "https://www.galaandco.com/contact.html",
  "mainEntity": {
    "@type": "RealEstateAgent",
    "name": "Gala & Co",
    "telephone": "+91-98765-43210",
    "email": "connect@galaandco.com",
    "address": { ... }
  }
}
```

---

## 6. Semantic HTML5 Structure

Every page uses correct, crawler-readable semantic tags:

| Element | Usage |
|---|---|
| `<html lang="en">` | Language declared on every page |
| `<header role="banner">` | Site header, crawlable navigation |
| `<nav aria-label="Primary navigation">` | Named navigation landmark |
| `<main id="main-content">` | Primary content area, skip-linked |
| `<section aria-labelledby="...">` | Each content section with heading ID reference |
| `<article>` | Each service and project card |
| `<address>` | Business contact information (on index + contact) |
| `<footer role="contentinfo">` | Footer with labelled navigation |
| `<figure>` + `<figcaption>` | Semantic image containers on services page |

---

## 7. Heading Hierarchy

Each page has **exactly one `<h1>`** with a clear heading hierarchy below it. There is no skipping of levels.

| Page | H1 | H2 Example | H3 Example |
|---|---|---|---|
| index.html | "Shaping Spaces That Reflect You" | "We Don't Build Properties..." | "Real Estate Advisory" |
| about.html | "About Gala & Co" | "We Don't Build Properties..." | "Precision" / "Legacy" |
| services.html | "Two Pillars. One Standard." | "Real Estate Advisory" / "Contracting" | — |
| contact.html | "Contact Gala & Co" | "Let's Create Something Extraordinary." | — |

---

## 8. Image SEO

All 6 images across the site are fully optimised for search engines.

| Image | Alt Text | Dimensions | Loading |
|---|---|---|---|
| `hero-building.jpg` (hero) | "Luxury high-rise building by Gala & Co real estate" | 1920×1080 | `fetchpriority="high"` |
| `hero-building.jpg` (section) | "Landmark luxury building developed by Gala & Co in Mumbai" | 1920×1080 | default |
| `lifestyle-interior.jpg` | "Luxury interior design by Gala & Co — premium residential space in Mumbai" | 800×1067 | `loading="lazy"` |
| `project-commercial.jpg` | "Gala & Co real estate advisory — premium commercial property analysis" | 800×450 | `loading="lazy"` |
| `project-construction.jpg` | "Gala & Co construction and contracting — luxury building under development" | 800×450 | `loading="lazy"` |
| `project-penthouse.jpg` | "The Azure Residences — premium luxury penthouse by Gala & Co" | 800×600 | `loading="lazy"` |
| `project-villa.jpg` | "Villa Serenità — exclusive private estate by Gala & Co" | 800×600 | `loading="lazy"` |
| `project-commercial.jpg` (projects) | "The Commerce Hub — premium commercial development by Gala & Co" | 800×600 | `loading="lazy"` |

All `alt` texts follow the pattern: **[Project/Item name] — [descriptive context] by Gala & Co [+ location]**.

---

## 9. Canonical URLs

Every page declares its own canonical to prevent duplicate content issues:

```html
<!-- index.html -->
<link rel="canonical" href="https://www.galaandco.com/" />

<!-- about.html -->
<link rel="canonical" href="https://www.galaandco.com/about.html" />

<!-- services.html -->
<link rel="canonical" href="https://www.galaandco.com/services.html" />

<!-- contact.html -->
<link rel="canonical" href="https://www.galaandco.com/contact.html" />
```

---

## 10. `sitemap.xml`

Located at the root: `https://www.galaandco.com/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.galaandco.com/</loc>
    <lastmod>2026-02-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.galaandco.com/about.html</loc>
    <lastmod>2026-02-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.galaandco.com/services.html</loc>
    <lastmod>2026-02-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.galaandco.com/contact.html</loc>
    <lastmod>2026-02-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Submit this URL to Google Search Console** after deployment.

---

## 11. `robots.txt`

Located at: `https://www.galaandco.com/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://www.galaandco.com/sitemap.xml
```

All crawlers permitted site-wide. Sitemap is declared inline for immediate discovery.

---

## 12. Page Speed & Core Web Vitals Optimisations

| Optimisation | Implementation |
|---|---|
| **No render-blocking JS** | `<script src="js/main.js" defer>` on all pages |
| **No render-blocking CSS** | Single `<link rel="stylesheet">` in `<head>` |
| **Font preconnect** | `<link rel="preconnect" href="https://fonts.googleapis.com">` on every page |
| **LCP image prioritised** | `fetchpriority="high"` on the hero image |
| **Below-fold lazy loading** | `loading="lazy"` on all non-hero images |
| **Explicit image dimensions** | `width` and `height` on every `<img>` (prevents CLS) |
| **Zero JavaScript dependencies** | No jQuery, no React, no external libraries |
| **Single CSS file** | One HTTP request for all styles |

---

## 13. Accessibility (Affects SEO)

Google's crawlers use the accessibility tree as part of their quality signals.

| Implementation | Tag/Attribute |
|---|---|
| Skip-to-content link | `<a class="skip-link" href="#main-content">Skip to main content</a>` |
| ARIA roles on regions | `role="banner"`, `role="contentinfo"`, `role="dialog"`, `role="list"` |
| Named navigations | `aria-label="Primary navigation"`, `aria-label="Footer navigation"` |
| Section headings linked | `aria-labelledby="[heading-id]"` on every `<section>` |
| Hamburger button | `aria-label="Toggle navigation menu"` + `aria-expanded="false"` |
| Decorative elements hidden | `aria-hidden="true"` on SVG, overlays, dividers |
| Form accessibility | `<label for="...">` paired with every `<input>` |
| Live region for form success | `role="status" aria-live="polite"` on success message |
| Projects grid | `role="list"` on grid + `role="listitem"` + `aria-label` on each card |

---

## 14. Internal Linking Structure

All inter-page links use descriptive anchor text and correct `.html` paths.

```
index.html ──→ about.html, services.html, contact.html, #about, #services, #projects, #contact
about.html ──→ index.html, services.html, contact.html, index.html#projects
services.html ──→ index.html, about.html, contact.html, index.html#projects
contact.html ──→ index.html, about.html, services.html, index.html#projects
```

The logo on every page links back to `index.html` with `aria-label="Gala & Co — Home"`.

Contact click-to-call and click-to-email links are present and crawlable:
```html
<a href="tel:+919876543210">+91 98765 43210</a>
<a href="mailto:connect@galaandco.com">connect@galaandco.com</a>
```

---

## 15. Tracking — Google Analytics 4

A GA4 snippet placeholder is present in the `<head>` of all 4 pages, loaded `async` (non-blocking):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

> **Action required:** Replace `G-XXXXXXXXXX` with the actual GA4 Measurement ID on all 4 pages.

---

## 16. Compliance Checklist — Summary

| SEO Item | Status |
|---|---|
| Unique `<title>` per page | ✅ |
| Unique `<meta description>` per page | ✅ |
| One `<h1>` per page | ✅ |
| Correct H2/H3 hierarchy per page | ✅ |
| Canonical tag per page | ✅ |
| `robots: index, follow` per page | ✅ |
| Open Graph tags per page | ✅ |
| All images have descriptive `alt` text | ✅ |
| All images have `width` + `height` | ✅ |
| `fetchpriority="high"` on LCP image | ✅ |
| `loading="lazy"` on below-fold images | ✅ |
| `RealEstateAgent` JSON-LD on all pages | ✅ |
| `WebSite` JSON-LD on homepage | ✅ |
| `Service` JSON-LD (×2) on services page | ✅ |
| `ContactPage` JSON-LD on contact page | ✅ |
| `sitemap.xml` with all 4 URLs | ✅ |
| `robots.txt` with sitemap reference | ✅ |
| `<html lang="en">` on all pages | ✅ |
| Semantic HTML5 elements throughout | ✅ |
| `<address>` for business contact info | ✅ |
| Zero render-blocking JavaScript | ✅ |
| Font preconnect for performance | ✅ |
| `<script defer>` for JS | ✅ |
| All content in raw HTML (no JS required) | ✅ |
| GA4 placeholder in `<head>` of all pages | ✅ — awaiting Measurement ID |

---

## 17. Pending Actions for SEO Team

| Action | Priority |
|---|---|
| Replace `G-XXXXXXXXXX` with GA4 Measurement ID in all 4 HTML files | 🔴 High |
| Submit `sitemap.xml` to Google Search Console after deployment | 🔴 High |
| Verify domain ownership in Google Search Console | 🔴 High |
| Submit `sitemap.xml` to Bing Webmaster Tools | 🟡 Medium |
| Update `sameAs` social profile URLs in LocalBusiness schema | 🟡 Medium |
| Add Twitter/X Card meta tags for Twitter sharing previews | 🟡 Medium |
| Confirm `lastmod` dates in `sitemap.xml` after each content update | 🟢 Low |
| Connect contact form to backend (Formspree) — improves conversion signals | 🟢 Low |
