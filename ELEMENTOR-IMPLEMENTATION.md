# Elementor Implementation Plan

This plan assumes Elementor containers, Elementor Pro Theme Builder, and the existing WordPress content. The target is a close production rebuild without turning the page into a custom application.

**Current revision:** Use `HOMEPAGE-STRUCTURE-CONTENT.md` and `ELEMENTOR-START-HERE.md` for the canonical 4 August 2026 order and copy. They supersede any older placement or removal decision in this longer technical reference.

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

- **Structure:** One full-width container with a responsive background image → constrained inner container with the fixed H1, concise lead, separate animated supporting line, CTA row, and positioning note. Do not add an eyebrow or a trust/number rail.
- **Widgets:** Image, Heading, Text Editor, and Buttons.
- **Pro:** Not required beyond Theme Builder context.
- **Custom CSS:** Image crop, dark readability overlay, and responsive type.
- **Custom JavaScript:** A small typewriter controller changes only the `aria-hidden` supporting word. The H1 and lead remain fixed, and the complete supporting sentence remains available to screen readers.
- **Mobile:** Keep the full headline, supporting line, and two CTAs visible while leaving a hint of the next homepage section.
- **Performance:** Use the approved WebP image, preload it, and do not add background video or a third-party player.
- **Important:** Keep the exact H1 as a real Heading widget set to HTML tag `h1`. Use only one H1.

### 3. Partner ecosystem logo rail

- **Placement:** After Synergi in Numbers and before the Podcast.
- **Structure:** One horizontal parent container with the class `syg-partner-logo-rail` and custom attribute `data-syg-partner-logo-rail`. Inside it, add one inner `syg-partner-logo-track` container. Give every linked logo card the class `syg-partner-logo-item` and custom attribute `data-syg-partner-logo`.
- **Widgets:** Heading, Text Editor, and linked Image widgets inside the single horizontal track. The lightweight script creates decorative copies only to make the motion continuous.
- **Interaction:** The logos move slowly to the left and always retain their original colours. Hovering or keyboard-focusing a logo pauses the line and adds a restrained cyan glow around that logo. Visitors can drag with a cursor in either direction or swipe with a finger; releasing the rail resumes the gentle leftward motion once the pointer leaves the logo.
- **Mobile:** The rail remains a smaller, touch-friendly horizontal row. Native vertical page scrolling still works, and no carousel widget is needed.
- **Accessibility:** Every logo remains a normal keyboard-focusable link. Dragging suppresses only the accidental link click that follows a drag.
- **Performance:** Use the existing local logo files with dimensions. No slider library, autoplay timer, duplicate tracks, or remote logo requests.

### 4. Core BPO services

- **Structure:** Two-column parent container. The left column contains the heading, concise explanatory copy, and arrow controls. The right column is a relative-positioned stage containing six overlapping Elementor card containers.
- **Widgets:** Containers, Heading, Image/Icon, Text Editor, Icon List, Buttons.
- **Pro:** No.
- **Elementor setup:** Give the stage and each card the CSS classes shown in the prototype. Add `data-service-card` to every card through Elementor’s Custom Attributes field. The content remains fully editable in Elementor.
- **Custom CSS:** Absolute card stacking, six restrained service treatments, exposed card edges, responsive fan offsets, compact two-column capability panels with a shared taller card height, and transform transitions. No canvas, slider library, or WebGL is required.
- **Custom JavaScript:** Small controller for previous/next, deck-position updates, arrow keys, mouse drag, touch swipe, live status, and inactive-card focus management.
- **Mobile:** Stack the copy above the deck, reduce the fan offsets and type scale, keep the arrow controls visible, and retain swipe while keeping every capability visible without an internal scrollbar.
- **SEO:** Render all six cards and service lists in the server HTML. JavaScript only changes card position and accessibility state; it must never fetch or generate the service copy.
- **Fallback:** Without JavaScript, the six cards become a normal vertical grid and every service remains visible.

### 5. Synergi in Numbers

- **Current decision:** Use the editorial Canvas 2D treatment only. The interactive Three.js/network review option is removed from the homepage.

- **Structure:** Centered introduction followed by a four-column number row and one decorative particle canvas.
- **Widgets:** Heading, Text Editor, four Button widgets, and one HTML widget containing the canvas and caption.
- **Pro:** No.
- **Custom CSS:** Stripe-inspired number-row pacing using Synergi navy, cyan, pale blue, and white. Numbers receive a subtle active line, lift, and background glow.
- **Custom JavaScript:** Use one Canvas 2D controller. Particles collapse into the center, then reshape for the selected figure. Nearby dots move gently under the pointer.
- **Mobile:** Change the number row to a two-by-two grid and lower the particle count from 192 to 110.
- **Accessibility:** The numbers remain real buttons with `aria-pressed`; the canvas is `aria-hidden`; reduced-motion users receive an immediate static shape.
- **Performance:** Render only during transitions or active pointer movement, cap device pixel density at 1.5, pause offscreen, and make no third-party requests.
- **Content:** Use the Company Overview figures: 50+ clients served, 5 global delivery locations, 100+ years of combined experience, and 10–15% direct savings. Show the visible source qualifier “Figures reported in the Synergi Company Overview dated 25 June 2026” and confirm the savings qualification before launch.

### 6. Why businesses choose Synergi

- **Structure:** Separate section with an H2 introduction and four native H3 reason cards.
- **Widgets:** Heading, Text Editor, and four nested Containers.
- **WordPress action:** Preserve this as a distinct, server-rendered section; do not merge it into the numbers visual.

### 7. Sector Experience — Industries served

- **Structure:** A compact heading with no introductory paragraph, followed by six images in a fixed order. The selected image grows in its current position while the other five compress into narrow image strips.
- **Widgets:** Heading, Text Editor, six native nested Containers, six Image widgets, six H3 Heading widgets, six Text Editor descriptions, and two real Button controls.
- **Elementor setup:** Give the outer section the `syg-concept-sections syg-sector-section` classes, then use `syg-industry-showcase`, `syg-industry-rail`, `syg-industry-card`, `syg-industry-image-button`, and `syg-industry-card-copy` inside it. Add `data-syg-industry-showcase` to the wrapper, `data-syg-industry-rail` to the rail, `data-syg-industry-card` to every card, and `data-syg-industry-go|0` through `data-syg-industry-go|5` to the image buttons. Use `data-syg-industry-prev`, `data-syg-industry-next`, and `data-syg-industry-status` for the controls and status text.
- **Pro:** No.
- **Custom CSS:** An 11:1:1:1:1:1 active-to-inactive flex hierarchy, a clean light section surface, subtle image hover response, visible focus rings, and a grid fallback when JavaScript is unavailable. Titles and descriptions only appear on the active card; no visual numbers are used.
- **Custom JavaScript:** A small controller changes the active state without rotating or reordering the card elements, allowing the clicked image to grow naturally where it sits. It supports arrow controls and Left/Right/Home/End keys, and announces the active industry. Do not clone articles or fetch their copy.
- **Mobile:** Use a horizontal touch rail with an active image around 74-76vw and five compressed image strips. On selection, scroll only as far as needed to keep the growing image visible; reduced-motion users receive immediate state changes.
- **SEO:** Never mark the section or inactive articles hidden on desktop, tablet, or mobile. Keep every H3, description, image, and alt text in the server HTML.

### 7B. Sector Experience — rotating queue alternative

- **Purpose:** Place this directly below the fixed-position Sector Experience section while the two interaction concepts are being compared. Remove the paragraph beginning “Synergi adapts its BPO” from both concepts.
- **Structure:** Keep one large lead image on the left, one smaller second image, one smaller third image, and three equal compressed image strips in a 16:4:2:0.3:0.3:0.3 hierarchy matching the supplied reference proportions.
- **Elementor setup:** Use `syg-concept-sections syg-industries-queue-section` on the outer section. Use `syg-industry-queue`, `syg-industry-queue-rail`, `syg-industry-queue-card`, `syg-industry-queue-image`, `syg-industry-queue-scrim`, `syg-industry-queue-preview`, and `syg-industry-queue-card-copy` for the nested elements. Add `data-syg-industry-queue` to the carousel wrapper, `data-syg-industry-queue-rail` to the rail, and `data-syg-industry-queue-card` to every card.
- **Controls:** Add `data-syg-industry-queue-go` to each image button, and use `data-syg-industry-queue-prev`, `data-syg-industry-queue-next`, and `data-syg-industry-queue-status` for the two arrows and live status.
- **Motion:** Treat the cards as a cyclic left-moving queue using the same natural flex resizing as the concept above, slowed to 900ms for clarity. Measure the final wrapped tail, reserve that exact width with one temporary flex placeholder, then collapse the cards before the selected image while the selected and following cards inherit their new sizes. Swap the hidden cards into the reserved tail after the transition with animations briefly disabled, preventing any visible second jump. For example, `1,2,3,4,5,6` selecting `2` becomes `2,3,4,5,6,1` in one readable transition.
- **Mobile:** Replace the compressed queue below 768px with one full-width active image and description. Use the existing arrows plus horizontal finger swipes, with a short fade/scale transition between industries.
- **WordPress:** Use native Elementor Containers, Image widgets, Heading widgets, Text Editor descriptions, and Button widgets. No Elementor Pro feature or external animation library is required.

### 8. Executive Podcast

- **Structure:** Dark full-width container → image column + content column.
- **Widgets:** Image, Heading, Text Editor, Button.
- **Pro:** Dynamic media is optional.
- **Custom CSS:** Framed artwork and media badge.
- **Dynamic option:** Use ACF or a Podcast custom post type only if it already exists. Do not install a plugin solely for one static homepage block.
- **Mobile:** Image first, text second, no automatic playback.
- **Video option:** Keep the artwork as a poster. Load an approved YouTube/Vimeo iframe only after the user activates the play control, or link to the episode hub as in the prototype. Never autoplay.
- **Approval:** Populate latest-episode details from the approved source before launch.

### 9. Shared Services and BPO SEO content

- **Structure:** Two-column editorial layout. Keep the visible Shared Services copy in the left column and the regional BPO/benefits content in a native Accordion on the right.
- **Widgets:** Heading, Text Editor, Button, Accordion.
- **Pro:** No.
- **Custom CSS:** Card surface and regional marker.
- **Mobile:** Stack and keep primary CTA close to the visible introduction.
- **SEO:** Do not use Display Conditions, responsive hide controls, or delayed AJAX loading for this copy.

### 10. Regional presence

- **Structure:** Intro followed by one horizontal parent container holding five linked location-card containers. Each card contains a background Image widget, number, city H3, entity label, delivered function, and compact CTA.
- **Widgets:** Containers, Image, Heading/Text, and links.
- **Pro:** No.
- **Custom CSS:** Flex-grow hover/focus expansion, image overlays, restrained zoom, and responsive horizontal scroll snapping.
- **Custom JavaScript:** None.
- **Mobile:** Convert the row into swipeable image cards with scroll snap. All information and CTAs remain visible because mobile cannot depend on hover.
- **Content:** Pull location labels from the Global Locations page or a shared data source where practical.
- **Images:** Upload the five optimized WebP files from `assets/images`, or replace them with approved Synergi photography using the same 3:2 crop.

### 11. Partners

- **Current decision:** Use one nine-logo marquee after Synergi in Numbers. Every primary logo links to one confirmed internal Partners page; the duplicate motion track is decorative.

### 12. Upcoming Events

- **Structure:** H2 introduction and editable native event cards linking to Media.
- **Dynamic option:** Use a Loop Grid only if a genuine Event post type, taxonomy, or Media source already exists.
- **Content rule:** Do not invent event names or dates. A truthful Media-centre route is the fallback until approved event data exists.

### 13. Blog and insights

- **Structure:** Heading and Loop Grid with three posts.
- **Widgets:** Elementor Pro Loop Grid and a custom Loop Item.
- **Pro:** Yes, recommended.
- **Dynamic data:** Featured image, category, publish date, title, excerpt, post URL.
- **Custom CSS:** Stagger only via CSS; no slider.
- **Mobile:** One-column grid.
- **Query:** Choose an explicit ordering rule with Synergi. The prototype uses verified current posts, but production should remain dynamic.

### 14. Social content

- **Current decision:** Add a native Latest from Social Media section with editable LinkedIn, Instagram, and YouTube cards plus a Contact Us CTA.
- **WordPress action:** Use approved, manually curated content or a controlled WordPress source. Do not make a remote embedded feed the only visible content.

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
4. Industries expanding-rail controller.
5. Hero supporting-word typewriter.
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
- Confirm all six industry articles are present in the server HTML, use unique optimized images, wrap correctly with both arrows, and remain keyboard operable.
- Confirm all service cards and benefits-disclosure content appear in the server HTML.
- Confirm visible focus states and keyboard operation.
- Confirm the header, menu, service deck, both sector concepts, logo rail, location cards, content grids, CTA, and footer work at 320px, 375px, 390px, 768px, 1024px, 1280px, 1440px, and 1920px.
- Confirm phone landscape layouts work on short viewports and the navigation remains vertically scrollable.
- Confirm there is no page-level horizontal overflow; horizontal movement should exist only inside intentional swipe/drag rails.
- Confirm the Synergi figures canvas uses Canvas 2D only, pauses offscreen, and makes no third-party request.
- Confirm the partner marquee pauses on hover/focus and becomes a static scroll row for reduced-motion users.
- Confirm the complete “by removing …” phrase stays on one line at 390px, 768px, 1280px, and 1440px.
- Confirm WebP/AVIF responsive images and dimensions.
- Confirm dynamic post card categories and dates.
- Confirm forms, analytics, consent, and spam protection.
- Confirm title, description, canonical, schema, and social metadata.
- Run Lighthouse and a real-device mobile test before replacing the live homepage.
