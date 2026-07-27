# Elementor Implementation Plan

This plan assumes Elementor containers, Elementor Pro Theme Builder, and the existing WordPress content. The target is a close production rebuild without turning the page into a custom application.

## Global setup

### Global colors

Configure these in **Site Settings → Global Colors**:

| Token | Value | Use |
|---|---:|---|
| Primary | `#1D4E89` | Brand headings, buttons, primary surfaces |
| Primary Deep | `#0B2341` | Hero, podcast, footer, navigation |
| Primary Ink | `#071A31` | Darkest text and backgrounds |
| Secondary | `#28ABE5` | Pathways, active states, links, small accents |
| Text | `#232324` | Body text |
| Text Soft | `#5C6673` | Supporting copy |
| Surface Soft | `#F3F5F8` | Alternating section background |
| Surface Blue | `#EDF5FA` | Regional and SEO surfaces |
| Border | `#D7E1E9` | Dividers and card borders |

Use tints of Primary and Secondary for hover and active states. Do not introduce unrelated coral, mint, purple, or orange section accents.

### Global typography

- Primary family: Montserrat.
- Body: 400; headings and navigation: 600–700.
- Self-host one WOFF2 file with `font-display: swap`; do not request Google Fonts at page load.
- H1: fixed sizes at desktop, tablet, and mobile breakpoints, with line height about 1.0–1.08.
- H2: fixed sizes at desktop, tablet, and mobile breakpoints.
- Body: 16–18px with 1.6–1.75 line height.
- Small uppercase labels: 11–13px with controlled letter spacing.

### Layout and DOM

- Site content width: 1280px maximum.
- Global horizontal padding: 20px mobile, 32px tablet, 48–56px desktop.
- Use one parent container per section and usually one inner container.
- Avoid nested “container inside container inside container” patterns.
- Use Grid or Flexbox controls instead of spacer widgets.
- Use global gap controls rather than empty columns.
- Use CSS pseudo-elements only for restrained lines and state indicators rather than extra widgets.
- Assign stable CSS classes from this prototype instead of relying on generated Elementor selectors.

## Section-by-section build

### 1. Header

- **Structure:** Theme Builder Header → one full-width parent container → inner horizontal container containing logo, Nav Menu, and CTA.
- **Widgets:** Site Logo, Nav Menu, Button, optional Icon for mobile toggle.
- **Pro:** Theme Builder and Nav Menu.
- **Custom CSS:** Transparent initial state, dark blurred sticky state, focus styles, asymmetric button radius.
- **Custom JavaScript:** Only if the existing Nav Menu widget cannot match the simple accessible mobile overlay. Prefer Elementor’s native accessible menu behavior first.
- **Mobile:** Full-width menu overlay, large touch targets, no mega menu.
- **Performance:** Do not add a separate sticky-header plugin.

### 2. Image-led executive hero

- **Structure:** One full-width container with a responsive background image → constrained inner container with the H1, concise lead, CTA row, and positioning note. Do not add an eyebrow or a trust/number rail.
- **Widgets:** Image, Heading, Text Editor, and Buttons.
- **Pro:** Not required beyond Theme Builder context.
- **Custom CSS:** Image crop, dark readability overlay, responsive type, and a fixed-width rotating-word slot. The entire “by removing …” phrase must stay on one line at every breakpoint; scale that line down on narrow phones instead of allowing it to wrap.
- **Custom JavaScript:** Small typewriter controller for the final phrase only. Keep the initial complete phrase in the server HTML.
- **Mobile:** Keep the full headline and two CTAs visible while leaving a hint of the moving partner section.
- **Performance:** Use the approved WebP image, preload it, and do not add background video or a third-party player.
- **Important:** Keep the exact H1 as a real Heading widget set to HTML tag `h1`. Use only one H1.

### 3. Partner ecosystem marquee

- **Placement:** Directly below the hero and before “What does your business need next?”
- **Structure:** Intro row followed by two identical horizontal logo tracks. The second track is decorative and uses `aria-hidden="true"` so the visual loop is seamless without duplicating links for assistive technology.
- **Widgets:** Heading, Text Editor, and linked Image widgets inside one horizontal container. Duplicate the visual track once.
- **Custom CSS:** Constant slow translation, grayscale-to-color logo hover, and pause on hover or keyboard focus.
- **Mobile:** Keep the same moving row with smaller logo cards. Do not switch to a heavy carousel widget.
- **Accessibility:** Stop the animation when `prefers-reduced-motion` is active and expose a normal horizontal scroll row instead.
- **Performance:** Use the existing local logo files with dimensions. No slider library, autoplay timer, or remote logo requests.

### 4. “What does your business need?” journey

- **Structure:** Intro container followed by a two-column Tabs layout.
- **Widgets:** Elementor Tabs or nested containers with buttons and content panels.
- **Pro:** No, unless using advanced nested tabs from the installed version.
- **Custom CSS:** Numbered dark navigation and white result surface.
- **Custom JavaScript:** Use Elementor Tabs where possible. If matching the prototype, add a small arrow-key-aware tab controller.
- **Mobile:** Stack the result below the choices. Allow the choice row to wrap; avoid a horizontally overflowing control if content becomes clipped.
- **SEO:** This is guidance content, not a replacement for the full service copy.

### 5. Core BPO services

- **Structure:** Two-column parent container. The left column contains the heading, explanatory copy, progress, arrow controls, and five direct-selection buttons. The right column is a relative-positioned stage containing five overlapping Elementor card containers.
- **Widgets:** Containers, Heading, Image/Icon, Text Editor, Icon List, Buttons.
- **Pro:** No.
- **Elementor setup:** Give the stage and each card the CSS classes shown in the prototype. Add `data-service-card` to every card and `data-service-go` to each selector button through Elementor’s Custom Attributes field. The content remains fully editable in Elementor.
- **Custom CSS:** Absolute card stacking, five restrained service gradients, exposed card edges, responsive fan offsets, and transform transitions. No canvas, slider library, or WebGL is required.
- **Custom JavaScript:** Small controller for previous/next, deck-position updates, direct service buttons, arrow keys, touch swipe, live status, and inactive-card focus management.
- **Mobile:** Stack the copy above the deck, reduce the fan offsets, show compact numbered selectors, and retain swipe plus arrow controls.
- **SEO:** Render all five cards and service lists in the server HTML. JavaScript only changes card position and accessibility state; it must never fetch or generate the service copy.
- **Fallback:** Without JavaScript, the five cards become a normal vertical grid and every service remains visible.

### 6. Our Impact

- **Structure:** Centered introduction followed by a four-column number row and one decorative particle canvas.
- **Widgets:** Heading, Text Editor, four Button widgets, and one HTML widget containing the canvas and caption.
- **Pro:** No.
- **Custom CSS:** Stripe-inspired number-row pacing using Synergi navy, cyan, pale blue, and white. Numbers receive a subtle active line, lift, and background glow.
- **Custom JavaScript:** Use one Canvas 2D controller. Particles collapse into the center, then reshape for the selected figure. Nearby dots move gently under the pointer.
- **Mobile:** Change the number row to a two-by-two grid and lower the particle count from 192 to 110.
- **Accessibility:** The numbers remain real buttons with `aria-pressed`; the canvas is `aria-hidden`; reduced-motion users receive an immediate static shape.
- **Performance:** Render only during transitions or active pointer movement, cap device pixel density at 1.5, pause offscreen, and make no third-party requests.
- **Content:** Use the verified Synergi figures: 50+ clients served, 5 global delivery locations, 100+ years of combined experience, and 10–15% direct savings. Do not reintroduce the removed operational-services network.

### 7. Why businesses choose Synergi

- **Final concept decision:** Replaced by the interactive connected-operations network.
- **WordPress action:** Do not create a separate section.

### 8. Industries served

- **Structure:** Two-column container with intro on the left and five editorial rows on the right.
- **Widgets:** Heading, Text Editor, five nested containers.
- **Pro:** No.
- **Custom CSS:** Sticky desktop intro and row hover state.
- **Mobile:** Disable sticky behavior and stack normally.
- **SEO:** Unlike the current homepage, never mark this section hidden on desktop, tablet, and mobile.

### 9. Executive Podcast

- **Structure:** Dark full-width container → image column + content column.
- **Widgets:** Image, Heading, Text Editor, Button.
- **Pro:** Dynamic media is optional.
- **Custom CSS:** Framed artwork and media badge.
- **Dynamic option:** Use ACF or a Podcast custom post type only if it already exists. Do not install a plugin solely for one static homepage block.
- **Mobile:** Image first, text second, no automatic playback.
- **Video option:** Keep the artwork as a poster. Load an approved YouTube/Vimeo iframe only after the user activates the play control, or link to the episode hub as in the prototype. Never autoplay.
- **Approval:** Populate latest-episode details from the approved source before launch.

### 10. Shared Services and BPO SEO content

- **Structure:** Two-column editorial layout. Keep the visible Shared Services copy in the left column and the regional BPO/benefits content in a native Accordion on the right.
- **Widgets:** Heading, Text Editor, Button, Accordion.
- **Pro:** No.
- **Custom CSS:** Card surface and regional marker.
- **Mobile:** Stack and keep primary CTA close to the visible introduction.
- **SEO:** Do not use Display Conditions, responsive hide controls, or delayed AJAX loading for this copy.

### 11. Regional presence

- **Structure:** Intro followed by one horizontal parent container holding five linked location-card containers. Each card contains a background Image widget, number, city, country, and compact CTA.
- **Widgets:** Containers, Image, Heading/Text, and links.
- **Pro:** No.
- **Custom CSS:** Flex-grow hover/focus expansion, image overlays, restrained zoom, and responsive horizontal scroll snapping.
- **Custom JavaScript:** None.
- **Mobile:** Convert the row into swipeable image cards with scroll snap. All information and CTAs remain visible because mobile cannot depend on hover.
- **Content:** Pull location labels from the Global Locations page or a shared data source where practical.
- **Images:** Upload the five optimized WebP files from `assets/images`, or replace them with approved Synergi photography using the same 3:2 crop.

### 12. Partners

- **Final concept decision:** Moved directly below the hero as the partner ecosystem marquee in section 3.
- **WordPress action:** Do not create a second partner section later on the page.

### 13. Blog and insights

- **Structure:** Heading and Loop Grid with three posts.
- **Widgets:** Elementor Pro Loop Grid and a custom Loop Item.
- **Pro:** Yes, recommended.
- **Dynamic data:** Featured image, category, publish date, title, excerpt, post URL.
- **Custom CSS:** Stagger only via CSS; no slider.
- **Mobile:** One-column grid.
- **Query:** Choose an explicit ordering rule with Synergi. The prototype uses verified current posts, but production should remain dynamic.

### 14. Social content

- **Final concept decision:** Removed from the homepage because the static placeholder added length without improving the executive journey.
- **WordPress action:** Keep the verified social-profile links in the footer. Add a live feed only after Synergi approves the value, consent handling, and Core Web Vitals impact.

### 15. Final CTA

- **Structure:** Full-width primary container → two-column inner container with text and CTA stack.
- **Widgets:** Heading, Text Editor, two Buttons.
- **Pro:** No.
- **Custom CSS:** Reuse the connection-field SVG and asymmetrical buttons.
- **Mobile:** Full-width buttons.

### 16. Footer

- **Structure:** Theme Builder Footer → four columns plus bottom legal row.
- **Widgets:** Site Logo, Text Editor, Icon List/Nav Menu, Buttons.
- **Pro:** Theme Builder.
- **Custom CSS:** Dark surface, restrained dividers, responsive two-then-one-column behavior.
- **Dynamic:** Use the WordPress menu system for company/service/legal links so destinations remain centrally managed.

## Custom-code boundary

Keep production custom code limited to:

1. Global CSS tokens and shared utility classes.
2. Header sticky state if the installed Elementor version cannot provide the exact behavior.
3. Core-services card carousel controller.
4. Optional guided-journey tab controller.
5. Hero phrase typewriter.
6. Partner-marquee motion and reduced-motion fallback.
7. Lightweight Synergi figures Canvas 2D controller.
8. Reduced-motion and reveal enhancement.

Place JavaScript in one deferred file enqueued by the child theme or a controlled snippets mechanism. Do not paste duplicate scripts into multiple HTML widgets.

## Plugin policy

Use the current WordPress stack first. Do not add plugins for:

- Sticky header.
- Scroll animations.
- A single accordion or tab interaction.
- Logo carousels.
- Background effects.
- Responsive visibility.

Elementor/Elementor Pro, the current SEO plugin, the approved forms solution, and the existing caching/image optimization layer should be sufficient.

## Pre-launch Elementor checklist

- Confirm the exact live menu destinations.
- Confirm only one H1.
- Confirm the hidden Industries container from the old homepage is not carried over.
- Confirm all service cards and benefits-disclosure content appear in the server HTML.
- Confirm visible focus states and keyboard operation.
- Confirm header and menu work at 390px, 768px, 1280px, and 1440px.
- Confirm no horizontal overflow.
- Confirm the Synergi figures canvas uses Canvas 2D only, pauses offscreen, and makes no third-party request.
- Confirm the partner marquee pauses on hover/focus and becomes a static scroll row for reduced-motion users.
- Confirm the complete “by removing …” phrase stays on one line at 390px, 768px, 1280px, and 1440px.
- Confirm WebP/AVIF responsive images and dimensions.
- Confirm dynamic post card categories and dates.
- Confirm forms, analytics, consent, and spam protection.
- Confirm title, description, canonical, schema, and social metadata.
- Run Lighthouse and a real-device mobile test before replacing the live homepage.
