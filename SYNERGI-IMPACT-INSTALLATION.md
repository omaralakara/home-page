# Synergi impact section

The finished component is separated into the requested implementation files:

1. **Semantic HTML:** `components/synergi-impact-section.html`
2. **CSS:** `css/impact-section.css`
3. **Vanilla JavaScript:** `js/impact-section.js`
4. **Installation:** the steps below
5. **Configuration:** the clearly marked `SYNERGI IMPACT CONFIGURATION` object at the top of `js/impact-section.js`

The same HTML is already installed in `index.html`.

## Normal HTML website

1. Copy the component HTML into the page where the statistics should appear.
2. Load `css/impact-section.css` after the site's brand/design-system styles.
3. Load `js/impact-section.js` once with `defer`, ideally before `</head>` or `</body>`.

```html
<link rel="stylesheet" href="css/impact-section.css">
<script src="js/impact-section.js" defer></script>
```

There is no build step, remote asset, framework, or external library.

## Elementor adaptation

1. Add one HTML widget and paste the semantic HTML into it.
2. Enqueue `impact-section.css` and `impact-section.js` once through the child theme or a site-level custom-code manager. Do not paste the script into multiple widgets.
3. If Elementor supplies the outer section/container, keep every `synergi-impact-*` class and all `data-synergi-impact-*` attributes unchanged.
4. Keep the four controls as real `<button>` elements. This preserves focus, Enter/Space activation, and touch toggling.
5. After publishing, clear Elementor's generated CSS cache and test at desktop, tablet, and mobile breakpoints.

## Configuration

Edit only the object at the top of `js/impact-section.js` to change:

- Statistic values, descriptions, and visual labels
- Brand and particle colors
- Desktop, tablet, and mobile particle counts
- Animation speed and idle rotation/float rates
- Desktop, tablet, and mobile canvas heights
- Morph transition duration

If visible statistic copy changes, update the semantic HTML and the matching configuration entry together so the no-JavaScript content and interaction label remain identical.
