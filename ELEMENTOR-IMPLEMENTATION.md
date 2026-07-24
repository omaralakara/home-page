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
| Surface Soft | `#F4F7FA` | Alternating section background |
| Surface Blue | `#EDF5FA` | Regional and SEO surfaces |
| Border | `#D7E1E9` | Dividers and card borders |

Do not introduce additional decorative brand colors without approval.

### Global typography

- Primary family: Montserrat.
- Body: 400; headings and navigation: 600–700.
- Load only the weights actually used.
- H1: responsive clamp equivalent of 45–92px, line height about 1.0–1.08.
- H2: responsive 34–56px.
- Body: 16–18px with 1.6–1.75 line height.
- Small uppercase labels: 11–13px with controlled letter spacing.

### Layout and DOM

- Site content width: 1280px maximum.
- Global horizontal padding: 20px mobile, 32px tablet, 48–56px desktop.
- Use one parent container per section and usually one inner container.
- Avoid nested “container inside container inside container” patterns.
- Use Grid or Flexbox controls instead of spacer widgets.
- Use global gap controls rather than empty columns.
- Use CSS pseudo-elements for decorative circles and pathways rather than extra widgets.
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

### 2. Interactive hero

- **Structure:** One full-width dark container → constrained two-column inner container. Left column contains eyebrow, H1, two paragraphs, CTA row. Right column contains one HTML widget for the five-node interaction.
- **Widgets:** Heading, Text Editor, Buttons, HTML.
- **Pro:** Not required beyond Theme Builder context.
- **Custom CSS:** Grid background, pathway lines, node placement, responsive stack.
- **Custom JavaScript:** About 40–60 lines to update the active service label, description, destination, and SVG path.
- **Mobile:** Replace orbital positions with a compact two-column button grid and one full-width description panel. Keep the whole hero within the initial viewport.
- **Important:** Keep the exact H1 as a real Heading widget set to HTML tag `h1`. Use only one H1.

### 3. Trust strip

- **Final concept decision:** Removed because it duplicated the full Partners section and made the page feel longer.
- **WordPress action:** Do not build this section. Keep the single linked partner grid later on the page.

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

- **Structure:** Full-width primary-blue container → two-column inner container.
- **Widgets:** Heading, Text Editor, four numbered inner containers.
- **Pro:** No.
- **Custom CSS:** Large type, restrained circular background using pseudo-elements.
- **Mobile:** Stack content and keep all qualitative proof points visible.
- **Approval:** Do not add numeric counters until Synergi supplies verified figures and approval.
- **Content:** This section also contains the current “Why Choose Synergi” introduction and four reasons, reducing duplication while preserving the live copy.

### 7. Why businesses choose Synergi

- **Final concept decision:** Merged into Our Impact.
- **WordPress action:** Do not create a separate section; place the heading, introduction, and four verified reasons in the right side of the Impact layout.

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

- **Structure:** Heading followed by a three-column logo grid.
- **Widgets:** Image Box or Image widgets inside linked containers.
- **Pro:** No.
- **Custom CSS:** Grayscale-to-color hover and single-pixel grid dividers.
- **Mobile:** Two columns, then one on very narrow screens.
- **Performance:** Convert approved transparent PNG/JPEG files to WebP/AVIF where quality allows. Use image dimensions and lazy loading.

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
3. Hero service-node controller.
4. Core-services card carousel controller.
5. Optional guided-journey tab controller.
6. Reduced-motion and reveal enhancement.

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
- Confirm WebP/AVIF responsive images and dimensions.
- Confirm dynamic post card categories and dates.
- Confirm forms, analytics, consent, and spam protection.
- Confirm title, description, canonical, schema, and social metadata.
- Run Lighthouse and a real-device mobile test before replacing the live homepage.
