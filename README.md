# タコとハイボール - Tako to Highball

A single-page site for **Tako to Highball**, a fourteen-seat Japanese counter in
Moscow. Static: plain HTML, CSS and JavaScript, no build step, no dependencies.
English and Russian copy ship together behind an EN/RU toggle.

## Sections

Hero (facade) → the counter → three dishes from the chef → the highball →
chef, with the video pinned while the copy scrolls → practical visit info →
reservation → footer.

## Design

Off-black, bone white, one red accent, used the same way on every section.
Noto Serif carries Latin and Cyrillic display type, Noto Serif JP carries the
Japanese name, and Manrope handles UI and body copy. The two Noto faces come from
one type system, so switching to Russian never drops into a mismatched fallback.

Motion is deliberate rather than decorative:

- **Line masks.** Headlines slide up from behind their own edge. `js/main.js`
  wraps each `.mask` in an inner element at runtime, so the markup stays clean.
- **Uncover.** Photography and video reveal behind a shutter that lifts while the
  frame settles out of a slight scale, instead of a plain fade.
- **Pinned chef.** The chef video stays fixed while the copy beside it scrolls past.
- **Hero drift.** A scroll-linked parallax on the facade via CSS
  `animation-timeline: scroll()`, desktop only, behind an `@supports` check. It
  moves only when the page moves, so there is no idle animation loop.

Everything above collapses to a static page under `prefers-reduced-motion`.

## Project structure

```
index.html         Markup, both languages inline via data-i18n-en / data-i18n-ru
css/style.css      All styles, custom properties, no framework
js/main.js         Reveals, nav state, mobile menu, language toggle,
                    lazy video, reservation form
assets/img/        Facade, 3 dish photos, 3 video posters, favicon
assets/video/      3 clips: plating, counter, live fire
dev-server.py      Local dev server with HTTP range support
```

Each photo and clip is used in exactly one place on the page. The only repeat is
`hero-exterior.jpg` in the `og:image` meta tag, which is not rendered on the page.

## Running locally

Any static server works, but video seeking needs HTTP range support, which
Python's built-in `http.server` does not provide. A small range-enabled server is
included:

```bash
python dev-server.py 8080
```

Then open `http://localhost:8080`. Production hosts (GitHub Pages, Netlify,
Vercel) support range requests already, so nothing extra is needed there.

## Assets

Every photo and clip was supplied by the client. Video posters are frames pulled
from their own clip, so a poster never introduces unrelated imagery. All clips are
re-encoded for the web: H.264, 1600px wide, faststart, audio stripped since every
instance is muted. Total media weight is roughly 9 MB, and only the facade photo
loads on first paint. The three clips attach their sources as their section comes
within range.

## Language toggle

Translatable elements carry `data-i18n-en` and `data-i18n-ru`. `applyLang()` in
`js/main.js` swaps `innerHTML`, stores the choice in `localStorage`, and updates
`<html lang>`. Masked headlines are written into their inner wrapper so the reveal
survives a language switch. To add a string, add both attributes to the element.

## Reservation form

Fully styled and interactive, with validation, a past-date guard and a
confirmation state, but **not wired to a backend**. Submitting swaps in a
confirmation panel so the flow can be reviewed end to end. To make it live, point
the `#res-form` submit handler in `js/main.js` at a booking API, form service or
serverless function.

## Placeholder content

Invented and to be replaced before launch:

- Chef name and bio: `#chef` in `index.html`
- Dish names, descriptions and prices: `#menu`
- Drink list and prices: `#highball`
- Address, phone, email, hours: `#visit` and the footer
