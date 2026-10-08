# Umair Lone — Design & Engineering Studio

A single-page studio website: hand-built HTML, CSS and vanilla JavaScript. No build step, no frameworks, no trackers. Drop it on any static host (GitHub Pages, Netlify, Cloudflare Pages, S3).

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Full page markup — hero, services, process, work, metrics, timeline, testimonials, pricing, FAQ, contact |
| `styles.css` | Design tokens, dark/light themes, layout, components, responsive rules |
| `script.js` | Theme toggle, mobile nav, scroll reveal, animated counters, tabs, carousel, form validation |

## Features

- Dark-first theme with a light mode (toggle, remembered in `localStorage`)
- Fully responsive — desktop, tablet, mobile
- Scroll-reveal animations and count-up metrics (respects `prefers-reduced-motion`)
- Accessible: semantic landmarks, skip link, ARIA on tabs/carousel/nav, keyboard-friendly
- Self-contained — the only external request is Google Fonts

## Run locally

Just open `index.html` in a browser. Or serve it:

```bash
python3 -m http.server 8000
```

## Deploy to GitHub Pages

1. Push these files to a repository.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
3. Your site is live at `https://<username>.github.io/<repo>/`.

## Customising

- **Colour & type** — edit the CSS variables at the top of `styles.css` (`:root` and `html[data-theme="light"]`).
- **Copy** — all text lives directly in `index.html`.
- **Contact form** — the form validates client-side only. To receive submissions, point it at a service such as Formspree, Getform or your own endpoint.
