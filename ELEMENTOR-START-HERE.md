# Elementor Start Here

This revision is designed to be rebuilt with native Elementor Containers, Heading, Text Editor, Image, and Button widgets. The only custom behavior is one small site-wide CSS/JavaScript layer; no slider, animation, or background-effect plugin is required.

## Recommended build order

1. Header template
2. Hero
3. Partner ecosystem marquee
4. What does your business need next?
5. Core BPO Services
6. Connected operations network
7. Executive Podcast
8. Shared Services
9. Regional presence
10. Blog Loop Grid
11. Final CTA
12. Footer template

Keep every major section as a top-level Elementor Container. Do not place the whole page in one HTML widget.

## Existing editable helpers

The WordPress folder already includes:

- `synergi-build-editable-elementor-draft.php` for the editable Core BPO Services and Regional Presence container trees.
- `synergi-homepage-concept-sections.php` as a shortcode-based fallback for those two interaction-heavy sections.

Use the editable builder first. Keep the shortcode only as a fallback or a fast review method.

## Hero

Create one full-width Container with class:

`hero`

Add the local WebP as its background or as an Image widget with class `hero-media`. Add one overlay Container with class `hero-shade`, then one constrained inner Container with classes:

`hero-layout container`

Use a real Heading widget set to `h1`. Its content should preserve this structure:

```html
Make the work behind growth easier to run
<span class="hero-type-line">
  <span>by removing</span>
  <span class="hero-word-slot">
    <span class="hero-typeword" data-hero-typewords="manual work,silos,delays,extra overhead">manual work</span>
    <span class="hero-caret" aria-hidden="true"></span>
  </span>
</span>
```

Do not add the old eyebrow. Do not add a statistic or trust rail. The `hero-word-slot` reserves the width of the longest phrase so the heading never reflows when the word changes.

## Partner ecosystem marquee

Place this section immediately after the hero. Use the top-level class:

`partner-marquee-section`

Build one intro Container with classes:

`partner-marquee-intro container`

Below it, create a horizontal Container with class `partner-marquee`. Inside, create two identical horizontal Containers with class `partner-marquee-track`.

- First track: nine linked Image widgets with visible partner names or category labels.
- Second track: duplicate visual content, remove links, and add `aria-hidden="true"` in Advanced → Attributes.
- Keep the partner order identical in both tracks for a seamless loop.

The animation must pause when a logo is hovered or keyboard-focused. Reduced-motion visitors receive one normal horizontal scroll row.

## Interactive Synergi figures

Use the complete component in `components/synergi-impact-section.html`. For the first Elementor version, the most reliable approach is one HTML widget containing that semantic markup.

Every component class is prefixed with `synergi-impact-`. Keep the top-level `data-synergi-impact` attribute, the four `data-synergi-impact-state` values, and the canvas attribute unchanged. The four statistics are real buttons, so keyboard focus, Enter/Space activation, and mobile tap toggling work without an Elementor interaction add-on.

Enqueue these files once through the child theme or a site-level custom-code manager:

- `css/impact-section.css`
- `js/impact-section.js`

The canvas uses 340 particles on desktop, 220 on tablet, and 120 on mobile. The same particles interpolate between all saved target configurations in 850 milliseconds; they are not destroyed and recreated during a morph. Connections are predetermined, device pixel density is capped at 1.5, and rendering pauses outside the viewport or while the browser tab is hidden.

Canvas is appropriate here because it is decorative and has `aria-hidden="true"`; the four meaningful figures remain accessible and indexable in native HTML. Reduced-motion visitors receive static configurations with immediate state changes.

See `SYNERGI-IMPACT-INSTALLATION.md` for the full installation and configuration notes.

## Final CTA

Place the CTA directly after the Blog Loop Grid and before the footer. Use:

`section final-cta`

The inner Container uses:

`container final-cta-inner`

Keep two columns on desktop: message on the left and two buttons on the right. Stack on mobile. Use the existing WordPress Contact and Services URLs.

## Where custom code belongs

Keep one CSS file and one deferred JavaScript file in the child theme, then enqueue them once. Do not paste duplicate scripts into individual Elementor widgets.

For a first local Elementor test, the CSS rules are in:

- `css/variables.css`
- `css/styles.css`
- `css/responsive.css`
- `css/executive-redesign.css`

The interaction controller is:

- `js/main.js`

For production, extract only the classes used by the final Elementor page after the layout is approved. This keeps the first experiment fast while avoiding unnecessary CSS long term.

## Quick acceptance check

- No “50+ clients served” row appears in the hero.
- No “Shared services for UAE and Gulf operators” eyebrow appears.
- The rotating phrase never changes the H1 height.
- Partner logos move directly below the hero.
- “What does your business need next?” and “Our Core BPO Services” are unchanged.
- The old route/design board is absent.
- The four figures work with mouse, keyboard, touch, and reduced motion.
- Dots collapse to the center and reshape when a different figure is selected.
- Podcast, Shared Services, Regional Presence, and Blog remain in place.
- The final CTA appears before the footer.
- No horizontal page overflow at 390px.
