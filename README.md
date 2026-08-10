# Synergi Homepage Concept

A standalone, responsive homepage redesign prototype for Synergi Business Solutions. It uses semantic HTML, modern CSS, vanilla JavaScript, local images, and lightweight SVG only.

The canonical 2026 content and Elementor blueprint is `HOMEPAGE-STRUCTURE-CONTENT.md`. It supersedes older section-order decisions in the supporting audit notes.

## Preview

The fastest option is to open `index.html` directly in a browser.

For the most reliable local preview, open a terminal in this folder and run:

```powershell
py -m http.server 8080
```

Then visit `http://localhost:8080`.

No package install or build step is required.

## Design strategy

1. **Current issue:** The live homepage has substantial useful content, but it is distributed across repeated sliders, dense text blocks, and sections with weak hierarchy. The SEO H1 also appears after a separate visual hero, delaying the page’s main message.
2. **Preserved:** Synergi’s audited navy `#1D4E89`, cyan `#28ABE5`, text `#232324`, soft surface `#F3F5F8`, self-hosted Montserrat typography, white wordmark, service offering, partner ecosystem, regional language, article links, navigation, metadata, and footer destinations.
3. **Reference principles:** Concentrix informed the sharp opening promise, clear service progression, and proof-led pacing. Accenture Managed Services informed the outcome-first pathways and operating-model narrative. Acoup informed the need to establish regional relevance and credibility early.
4. **Uniquely Synergi:** The hero combines authentic Dubai workplace photography with a direct six-function service journey. It presents Synergi as a boutique regional operating partner without imitating a global consultancy or relying on abstract AI-style graphics.
5. **SEO:** Existing keyword-focused copy remains in the initial HTML. Every service card and the native benefits disclosure are rendered before JavaScript runs.
6. **Elementor practicality:** Every section maps to ordinary Elementor containers, headings, buttons, images, icon lists, a lightweight layered card deck, and Loop Grid. The custom interactions require only a small site-wide CSS/JavaScript layer.
7. **Performance:** There is no framework, slider library, animation plugin, WebGL dependency, or third-party social feed on the homepage. The retained Synergi in Numbers design uses one decorative Canvas 2D surface, pauses offscreen, respects reduced motion, and keeps every metric as visible HTML text.

## Main interactions

- Transparent header becomes a dark blurred header after scrolling.
- Desktop dropdown menus and a full-screen accessible mobile menu.
- Image-led hero fits inside the initial desktop, tablet, and mobile viewport with one fixed, search-focused H1.
- A separate supporting line cycles through manual work, silos, delays, and unnecessary overhead without changing the H1 or accessible sentence.
- The partner ecosystem appears after Synergi in Numbers in a seamless, pause-on-hover logo loop with a reduced-motion scroll fallback.
- Core BPO services use an animated layered capability deck with previous/next controls, numbered direct-selection buttons, arrow keys, touch swipes, live announcements, and a fully visible no-JavaScript fallback.
- Industries use a six-image expandable rail: the selected image becomes the wide lead panel, previews remain visible, click and arrow controls wrap continuously, and all six H3 descriptions remain in the initial HTML.
- Four verified Synergi figures sit above a lightweight decorative particle field; the figures remain readable without animation.
- Native SEO disclosure keeps all benefits content present in the document.
- The podcast artwork is a video-ready interaction: it links to the approved episode hub without autoplaying or loading a third-party player.
- Scroll reveal uses `IntersectionObserver` and is disabled for reduced motion.
- All interaction content remains readable when JavaScript is unavailable.

## Content requiring Synergi approval

- Latest podcast episode title, artwork selection, destination, and supporting text. The concept uses the required approval marker.
- Public approval of the 50+ clients, 5 locations, 100+ combined years, and 10–15% direct savings figures reported in the Company Overview dated 25 June 2026, including the correct savings qualifier.
- Final approval of the visible article selection and whether it should be date-sorted automatically.
- Final approval of partner logo files and ordering, plus creation or confirmation of one internal Partners page.
- Creation or confirmation of the Project Management service page.
- Confirmation that the five Global Locations entries remain current before launch.
- Approval of the five location photographs or replacement with Synergi-owned photography before launch.
- Confirmation that the live footer’s 2026 copyright year should remain static or become dynamic.
- Final legal, analytics, consent, and form requirements for the production WordPress build.

## Existing Synergi assets reused

- White Synergi wordmark.
- Synergi Executive Podcast artwork.
- Current article images for inventory data, HR automation, and the PIF Strategy.
- Current partner logo files for innovawave, Pemo, Teradix, Lexzur, Odoo, ICXI, SAP, Menaitech, and Zoho.
- Current article titles, publication dates, categories, descriptions, and destination URLs.

All reused files were copied into `assets/images`; the prototype does not hotlink visible images.

## Original concept assets

- `assets/svg/connection-field.svg`
- Six lightweight service icons in `assets/icons`
- Six bespoke, optimized WebP industry scenes in `assets/images/industry-*.webp`

## Recommended new photography

These are optional production recommendations. The location explorer uses five free Unsplash photographs for the local concept; Synergi should approve or replace them before launch.

| Placement | Recommended subject and composition | Ratio | Delivery size | Suggested alt text |
|---|---|---:|---:|---|
| Optional hero enhancement | UAE-based senior business team in a modern operational setting, ample negative space on left or right, natural daylight, no staged handshakes | 16:10 | 1920 × 1200 | `Synergi business specialists coordinating operations in the UAE` |
| Our Impact | Two specialists reviewing a process map or operational dashboard, candid interaction, no readable confidential data | 4:5 | 1200 × 1500 | `Synergi specialists reviewing a coordinated business process` |
| Regional presence | Contemporary Abu Dhabi business district detail with restrained architecture and people at work | 16:9 | 1920 × 1080 | `Abu Dhabi business district representing Synergi’s regional presence` |
| Final CTA | Close editorial portrait of a regional business leader in conversation, composed for a dark blue overlay | 3:2 | 1800 × 1200 | `Business leader discussing operational priorities with Synergi` |

Recommended delivery format is AVIF with WebP fallback. Keep the original crop available in WordPress, create responsive sizes, and avoid embedding text inside imagery.

The redesigned prototype now uses `hero-dubai-team.webp`, sourced from [Misbaa eri on Pexels](https://www.pexels.com/photo/modern-office-meeting-with-diverse-team-31709062/) under the Pexels free-use license. The local file is resized to 1600 pixels wide and compressed as WebP for faster initial loading.

## Location photography used in the concept

All five files are cropped to 960 × 640 WebP and lazy-loaded. Source records are also kept in `assets/images/LOCATION-IMAGE-CREDITS.md`.

| Local file | Location | Source |
|---|---|---|
| `location-abu-dhabi.webp` | Abu Dhabi | [Sreevishnu Nair on Unsplash](https://unsplash.com/photos/abu-dhabis-skyline-overlooks-the-beautiful-turquoise-water-C9zIo0Kpx6o) |
| `location-doha.webp` | Doha | [Rhiannon Elliott on Unsplash](https://unsplash.com/photos/a-city-skyline-by-the-water-o_FuyZy4SGk) |
| `location-riyadh-2026.webp` | Riyadh | [Md Amir Umar on Pexels](https://www.pexels.com/photo/aerial-view-of-riyadh-city-skyline-in-saudi-arabia-30320202/) |
| `location-beirut-2026.webp` | Beirut | [Jo Kassis on Pexels](https://www.pexels.com/photo/beirut-cityscape-5054927/) |
| `location-bucharest-2026.webp` | Bucharest | [Pexels city view](https://www.pexels.com/photo/aerial-view-of-city-buildings-10560194/) |

## Project structure

```text
synergi-homepage-concept/
├── index.html
├── css/
│   ├── variables.css
│   ├── styles.css
│   ├── responsive.css
│   ├── executive-redesign.css
│   └── why-section.css
├── js/
│   ├── main.js
│   └── why-section.js
├── assets/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── svg/
├── validate_structure.py
├── README.md
├── HOMEPAGE-STRUCTURE-CONTENT.md
├── ELEMENTOR-START-HERE.md
├── ELEMENTOR-IMPLEMENTATION.md
├── SEO-PRESERVATION.md
└── CONTENT-MAPPING.md
```

Unused Three.js experiments, impact previews, historical screenshots, superseded location images, and removed media-section assets were deleted from the production folder.

## Production notes

- The prototype preserves the live canonical URL for migration review.
- Keep the current WordPress URLs. Do not recreate pages under new slugs.
- Keep partner motion in CSS and load only the JavaScript used by visible homepage interactions.
- Re-test structured data, canonical, title, description, heading order, alt text, analytics, and consent after the design is rebuilt in WordPress.

## Live-site safety

No live WordPress files, settings, content, plugins, menus, or templates were modified. This is a local-only concept.
