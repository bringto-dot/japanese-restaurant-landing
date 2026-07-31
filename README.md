# タコとハイボール — Tako to Highball

**[Live demo](https://bringto-dot.github.io/japanese-restaurant-landing/)**

*[Читать на русском](README.ru.md)*

A single-page restaurant site, built as a portfolio piece to practice and show
front-end craft beyond a template: layout, motion, typography, performance and
i18n, all in plain HTML/CSS/JS with no framework and no build step.

The restaurant, the chef, the menu and the address are fictional. The facade
photo and the three dish photos are real stock photography, used as the content
to design around.

![Hero](docs/preview/01-hero.jpg)

## What this project demonstrates

- **Layout and typography.** A sticky-media/scrolling-copy section for the chef,
  a two-photo split for the philosophy block, an editorial 3-up grid for the
  menu, a full-bleed video moment for the drinks. No section repeats the same
  layout twice. Alegreya (serif) and Manrope (grotesk) carry both English and
  Russian at full weight, no fallback fonts.
- **Motion with a reason.** Headlines wipe up from behind their own edge
  (`.mask`, wrapped at runtime in `js/main.js`). Photos and video reveal behind
  a shutter that lifts while the frame settles out of a slight zoom, instead of
  a plain fade. All of it is built on `IntersectionObserver` and CSS
  transitions/`animation-timeline`, nothing polls `scroll` events, and
  everything collapses to a static page under `prefers-reduced-motion`.
- **Real i18n, not a plugin.** Every string ships in both languages via
  `data-i18n-en` / `data-i18n-ru`; a toggle in the nav swaps `innerHTML` and
  remembers the choice. No layout breaks, no mismatched font when it switches
  to Cyrillic.
- **Performance as a constraint, not an afterthought.** The three video clips
  are re-encoded (H.264, capped width, faststart, audio stripped since every
  instance is muted) and only attach their `<source>` once their section is
  about to scroll into view. Total media on the page is under 10 MB, and only
  the hero photo loads on first paint.
- **Front end that behaves like it has a back end.** The reservation form
  validates, guards against past dates, and swaps in a confirmation state on
  submit, even though nothing is wired up server-side (documented below, not
  hidden).

## Screens

| | |
|---|---|
| ![Menu](docs/preview/02-menu.jpg) | ![Highball](docs/preview/03-highball.jpg) |
| ![Chef](docs/preview/04-chef.jpg) | ![Reservation](docs/preview/05-reservation.jpg) |

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies to
install. `dev-server.py` is a small local server with HTTP range support,
needed only because Python's built-in `http.server` can't seek video and the
built-in one this replaces cannot serve partial content.

```bash
python dev-server.py 8080
```

## Notes for anyone reading the code

- The reservation form has no backend. Submitting it shows a confirmation
  panel client-side; wiring it to a real endpoint is a matter of replacing the
  `submit` handler in `js/main.js`.
- All business details (name, chef, address, prices) are placeholders for a
  fictional concept, written to be internally consistent rather than accurate
  to any real place.
