# Elementor Start Here

Start with `HOMEPAGE-STRUCTURE-CONTENT.md`. It is the canonical 2026 section order, approved working copy, heading map, link map, Elementor widget map, SEO checklist, and client-approval list.

This homepage should be built with native Elementor Containers, Heading, Text Editor, Image, Icon List, Button, and Loop Grid widgets. Custom HTML is reserved for decorative canvases only. Do not place the complete homepage or its search-relevant copy in one HTML widget.

## Build order

1. Header template
2. Hero with the single H1 and one-sentence business brief
3. Six Core BPO Services
4. Six Industries We Serve groups
5. Why Choose Synergi
6. Synergi in Numbers
7. Nine-partner internal marquee
8. Executive Podcast
9. Shared Services regional SEO section
10. Five Locations with entity and delivered function
11. Upcoming Events
12. Insights Loop Grid
13. Latest from Social Media
14. Final CTA
15. Footer template

## Existing editable helpers

The WordPress folder contains:

- `synergi-build-editable-elementor-draft.php` for native editable Services and Locations trees.
- `synergi-homepage-concept-sections.php` as a shortcode review fallback for Services and Locations.

The shortcode is a preview fallback, not the final editing model. Build all indexable copy as native Elementor widgets. Parameterize the target page ID, media IDs, page URLs, and profile URLs before production; do not depend on draft ID `10382`.

## Hero

Use a Heading widget set to `H1` with this exact text:

**BPO Services in UAE & the Gulf to Power Your Business**

Place this one Text Editor sentence directly beneath it:

**Synergi runs and transforms non-core business functions through BPO, consulting, manpower augmentation, and technology-enabled shared services across the Gulf.**

Do not add a second heading, rotating H1 phrase, trust-stat row, or legacy keyword paragraph inside the hero.

Add a separate supporting paragraph after the stable lead: **Helping your business remove** `manual work`, `silos`, `delays`, and `unnecessary overhead`. Keep the full H1 and lead unchanged in the initial HTML, place the changing visual word in an `aria-hidden` span, and include the complete stable sentence in an `.sr-only` span for assistive technology. This gives the desired animation without deleting or replacing the SEO topic.

## Services

Create six native service-card Containers: Accounting, Human Resources, Procurement, Technology & AI, Marketing, and Project Management. Each card title is an H3 and each card contains a real link.

The Project Management page URL is proposed and must be confirmed or created before launch. All six cards should exist in the initial HTML even if JavaScript presents them as a layered deck.

## Industries carousel

Build six native nested Containers inside one rail Container. Every item uses an Image widget, an H3 Heading widget, and a Text Editor sentence. Assign stable classes/data attributes through **Advanced → CSS Classes** and **Custom Attributes**, then add two real Button controls for previous and next.

The first item is wide and the remaining five are narrow image previews. Clicking a preview promotes it to the wide position; the controls and keyboard arrows wrap continuously. On mobile, keep a wide active card plus touch-sized horizontal previews. Do not use Elementor Loop Carousel/Swiper for this treatment because cloned slides can repeat indexable headings. Keep the controller once in the child theme or Elementor Custom Code, not inside every card.

## Partners

Create nine linked Image widgets in the primary track. Every primary logo links to the one internal Partners page. Create a second visual track only for the seamless loop, remove its links, and set `aria-hidden="true"`.

The proposed `/partners/` page must be confirmed or created before launch. Do not restore the old external logo destinations on the homepage.

## Synergi in Numbers

Use the retained editorial design with native text and its decorative Canvas 2D layer:

- 50+ clients served
- 5 global delivery locations
- 100+ combined years of experience
- 10–15% direct savings
- Visible source: Company Overview dated 25 June 2026

Values and labels are normal text, not headings. The decorative canvas is `aria-hidden`, never replaces the text, remains available on mobile, and honors reduced motion.

## Events, insights, and social

- Use manual native Event cards until a genuine Event post type or Media source exists; never invent events or dates.
- Use Elementor Loop Grid for Insights so current posts can be queried.
- Use three native, manually curated Social cards for LinkedIn, Instagram, and YouTube. Do not rely on an embedded feed for all visible content.

## Custom-code boundary

Keep shared CSS and deferred JavaScript in the child theme or one approved site-level custom-code location. Do not paste duplicate scripts into widgets. JavaScript may enhance the service deck, industries rail, partner motion, counters, and decorative number visual, but all meaningful copy and links must work without it.

## Acceptance check

- One H1 only, using the approved regional BPO wording.
- Six service H3 cards and six industry H3 cards.
- Six unique industry images, working click/arrow/keyboard selection, and wraparound from item 6 to item 1.
- Four Why Choose H3 reasons.
- The single Synergi in Numbers section shows the dated source.
- Nine partner logos point to one confirmed internal page.
- Five city H3 cards each show entity and function.
- Upcoming Events points to Media without fictional details.
- Social cards point to approved profiles and Contact Us.
- Shared Services, KSA/Riyadh, Procurement, article, Podcast, Media, Global Locations, and Contact links remain crawlable.
- Title, description, canonical, and schema ownership remain with the SEO plugin.
- No horizontal overflow at 390px; all controls work by keyboard and with reduced motion.
