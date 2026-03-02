# Gala & Co — Luxury Real Estate Advisory & Contracting

A cinematic, high-end real estate website transitioned from a React Single Page Application (SPA) to a **fully static, multi-page website** optimized for SEO and performance.

## 🚀 Transition Overview

The project has been converted from a client-side React app into a zero-dependency static site. This ensures that all content is immediately indexable by search engines and loads instantly without moving parts.

### Key Changes Made:
- **Architecture**: Moved from a Single Page Application to a multi-page structure with standalone `.html` files.
- **Tech Stack**: Removed React, Vite, Tailwind, and TypeScript. The site now runs on pure **HTML5**, **CSS3**, and **Vanilla JavaScript**.
- **SEO Optimization**:
  - Unique `<title>` and `<meta name="description">` for every page.
  - Full **JSON-LD Schema Markup** (LocalBusiness, WebSite, Service, and ContactPage).
  - Proper semantic HTML5 tags (`<header>`, `<main>`, `<section>`, `<address>`, etc.).
  - `sitemap.xml` and `robots.txt` generated.
- **Animations**: All cinematic scroll reveals, parallax effects, and SVG animations have been meticulously recreated using pure CSS and Vanilla JS.
- **Cleanup**: All React source files (`/src`), build configurations (`vite.config.ts`, etc.), and `node_modules` have been removed to keep the codebase clean and portable.

## 📂 Project Structure

```text
gala-cinematic-journey-main/
├── .github/          # CI/CD Deployment configurations
├── assets/
│   ├── favicon.ico
│   └── images/       # Optimised project and lifestyle imagery
├── css/
│   └── styles.css    # Clean, scoped CSS with custom properties
├── js/
│   └── main.js       # Vanilla JS for all interactive components
├── index.html        # Home page (8 cinematic sections)
├── about.html        # Dedicated company history and values
├── services.html     # Expanded advisory and contracting details
├── contact.html      # Direct contact and visit request page
├── sitemap.xml       # For search engine indexing
└── robots.txt        # Crawler instructions
```

## 🛠️ How to View the Website

Since this is now a static site, you don't need `npm install` or any build commands.

### Option 1: Local Opening (Simplest)
1. Navigate to the project folder.
2. Double-click **`index.html`** to open it in your default browser.
3. You can navigate between pages using the links in the header.

### Option 2: Static Server (Recommended for testing)
If you have Node.js installed, you can run a local server to see how it behaves in a production-like environment:
```bash
npx serve .
```

## 📝 Post-Launch Configuration

### 1. Contact Form
The form is ready for a backend integration. We recommend using [Formspree](https://formspree.io/):
1. Sign up for a free account.
2. Update the `<form>` tag in `contact.html` and `index.html` with your unique ID:
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
3. Disable the placeholder submit handler in `js/main.js`.

### 2. Google Analytics
Every page includes a GA4 placeholder in the `<head>`.
- Search for `G-XXXXXXXXXX` in all 4 HTML files and replace it with your actual Measurement ID.

## 💎 Design Philosophy
The site maintains a "Cinematic Luxury" aesthetic using:
- **Typography**: *Cormorant Garamond* for elegance and *Outfit* for modern readability.
- **Color Palette**: Warm off-whites (`#f7f5f2`), deep charcoal (`#1f1f1f`), and signature primary burgundy (`#7a0205`).
- **Interactive Layers**: Subtle parallax, IntersectionObserver scroll reveals, and smooth transitions to guide the user's journey.
