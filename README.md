# タコとハイボール — Tako to Highball

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

**Language:** 🇬🇧 [English](README.md) · 🇷🇺 [Русский](README.ru.md)

**[Live demo](https://bringto-dot.github.io/japanese-restaurant-landing/)**

A concept landing page for a Japanese counter restaurant, built around a dark
editorial visual language, cinematic media and restrained typography.

The goal was to create a restaurant website that feels closer to a premium
brand presentation than a typical restaurant template.

## Overview

Tako to Highball is a fictional fourteen-seat Japanese counter restaurant.

The page was designed as a complete frontend concept with particular
attention to:

- visual composition and typography
- responsive layouts
- cinematic image and video presentation
- scroll-based motion
- bilingual content
- reservation flow
- media loading and performance

The restaurant, menu, chef and business details are fictional and were
created specifically for the concept.

## Preview

![Hero](docs/preview/01-hero.jpg)

The visual direction is intentionally restrained: dark surfaces, warm
photography, Japanese typography and a single red accent create the visual
identity of the page without relying on decorative UI elements.

The hero immediately establishes the atmosphere while keeping the main
actions and essential information readable over the photography.

## Visual direction

The interface uses a combination of serif display typography and a neutral
grotesk for supporting information.

Large editorial headlines create hierarchy, while small uppercase labels,
thin dividers and generous spacing keep the interface quiet and structured.

Instead of repeating the same card layout throughout the page, each section
has its own composition.

The result is a continuous visual narrative rather than a collection of
independent blocks.

## Menu

![Menu](docs/preview/02-menu.jpg)

The menu section uses a three-column editorial layout for the featured
dishes.

Each item combines photography, typography, price and a short description
without turning the content into conventional restaurant cards.

Hover interaction adds a subtle image scale and saturation change, keeping
the interaction noticeable without breaking the visual restraint of the
section.

## Motion and media

![Highball](docs/preview/03-highball.jpg)

Motion is used to control the pace of the page rather than simply decorate
it.

Images and videos reveal through a shutter-like transition combined with a
subtle zoom-out. Headings enter through masked line reveals, with small
delays between elements.

The page also uses video as part of the layout itself: full-screen media
sections and a sticky chef section make photography and motion part of the
composition rather than secondary decoration.

All reveal animations are handled with CSS and `IntersectionObserver`.

For browsers or users that do not support the required motion features, the
interface falls back to a static presentation. `prefers-reduced-motion` is
also respected.

## Chef section

![Chef](docs/preview/04-chef.jpg)

The chef section uses a split layout with persistent video on one side and
scrolling editorial content on the other.

On desktop, the media remains fixed while the content progresses through the
story. On smaller screens, the layout switches to a regular vertical flow.

This section was designed specifically to demonstrate how a long-form
content block can be made visually engaging without filling the page with
additional UI elements.

## Reservation

![Reservation](docs/preview/05-reservation.jpg)

The final section turns the visual presentation into a simple reservation
flow.

The form includes:

- date selection
- time selection
- number of guests
- name
- phone
- email
- optional note

Client-side validation prevents incomplete submissions and past dates. After
a valid submission, the form switches to a confirmation state.

The form is intentionally frontend-only in this concept. No reservation data
is sent to a real backend.

## Responsive layout

The layout was designed for desktop, tablet and mobile rather than simply
scaled down from the desktop version.

At smaller widths:

- desktop navigation becomes a compact mobile menu
- the three-column menu becomes a single-column layout
- the chef split-screen becomes a vertical sequence
- the reservation form reorganizes its fields
- information grids collapse into readable single-column blocks
- full-screen media sections adapt their positioning and overlays

The visual hierarchy stays consistent while the composition changes
according to the available space.

## Bilingual interface

The site supports English and Russian from the same frontend.

Content for both languages is stored directly in the markup and switched at
runtime. The selected language is preserved between visits using
`localStorage`.

Typography and spacing were also considered for both Latin and Cyrillic text
so that switching languages does not change the overall composition.

## Frontend

The project was deliberately built without a framework or UI library.

HTML · CSS · JavaScript

The implementation relies on native browser capabilities for:

- responsive CSS layouts
- CSS transitions and animations
- `IntersectionObserver`
- `animation-timeline` where supported
- native form validation
- lazy video loading
- client-side language persistence

No build system or external frontend dependencies are required.

## Performance

The page uses several techniques to keep the media-heavy presentation
lightweight:

- only the hero image is loaded immediately
- below-the-fold videos are attached when they approach the viewport
- videos are muted and optimized for background playback
- images use lazy loading where appropriate
- motion is disabled for users who prefer reduced motion

The visual result is intentionally media-heavy, so performance was treated
as part of the implementation rather than something to address afterwards.

## Project notes

This is a fictional restaurant concept created as a frontend portfolio
project.

The restaurant identity, chef, menu, prices, address and reservation details
are fictional. The photography used in the interface is stock photography
selected as visual content for the concept.

The reservation form demonstrates the complete frontend interaction, but it
is not connected to a real booking service or backend.
