# Three.js Impact Section Guide

This is the lightweight Three.js version of the "Synergi at a glance" section.
It keeps the four statistics as real HTML and uses WebGL only for the visual
network underneath them.

## Interaction

- The 50+ clients scene is selected when the section loads.
- A scene changes only when its number is clicked or activated by keyboard.
- Every change gathers the particles into the center, then reforms them into
  the newly selected scene.
- Moving the pointer across the visual creates a very small local response.
- The four scenes represent a connected client operating fabric, five routed
  delivery hubs, combined experience, and operations becoming more ordered
  and efficient.

## Local preview

Open:

```text
impact-three-preview.html
```

For the most reliable test, run the local static server from this folder:

```powershell
py -m http.server 8080
```

Then visit:

```text
http://localhost:8080/impact-three-preview.html
```

## Files

- `vendor/three.module.min.js`
- `css/impact-section.css`
- `css/impact-three-section.css`
- `js/impact-three-section.js`
- `impact-three-preview.html`

Do not load `js/impact-section.js` on the same section when using the Three.js
version. That file is the older Canvas 2D version.

## Elementor structure

Use the same semantic section HTML from the preview. The important pieces are:

```html
<section
  class="synergi-impact-section synergi-impact-section--three"
  data-synergi-impact-three
  data-active-state="clients"
  data-transition-phase="idle"
>
  ...
  <button class="is-active" data-synergi-impact-state="clients" aria-pressed="true">...</button>
  <button data-synergi-impact-state="locations">...</button>
  <button data-synergi-impact-state="experience">...</button>
  <button data-synergi-impact-state="savings">...</button>
  ...
  <canvas class="synergi-impact-canvas synergi-impact-three-canvas" data-synergi-impact-three-canvas></canvas>
</section>
```

In Elementor, you can either paste the whole section into one HTML widget for
the first test, or keep the heading/stat buttons editable as normal widgets and
add the required CSS classes plus `data-synergi-impact-state` attributes.
The script manages the active classes and section state after it loads.

## WordPress loading

Upload the Three.js module, CSS, and JS to the child theme or snippets-managed
asset folder. Enqueue the script as a module and only on the homepage.

```php
add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_front_page() ) {
        return;
    }

    wp_enqueue_style(
        'syg-impact-three',
        get_stylesheet_directory_uri() . '/assets/css/impact-three-section.css',
        array(),
        '1.0.0'
    );

    wp_enqueue_script(
        'syg-impact-three',
        get_stylesheet_directory_uri() . '/assets/js/impact-three-section.js',
        array(),
        '1.0.0',
        true
    );
} );

add_filter( 'script_loader_tag', function ( $tag, $handle, $src ) {
    if ( 'syg-impact-three' !== $handle ) {
        return $tag;
    }

    return '<script type="module" src="' . esc_url( $src ) . '"></script>';
}, 10, 3 );
```

Keep `vendor/three.module.min.js` at the relative path expected by the script,
or set a custom module URL on the section:

```html
<section data-synergi-impact-three data-three-module="/wp-content/themes/child/assets/vendor/three.module.min.js">
```

## Performance rules

- Load this only on the homepage.
- Do not run the old Canvas 2D impact script on the same section.
- Keep Three.js local instead of CDN-hosted in production.
- The script skips Elementor editor mode.
- Pixel ratio is capped at 1.5.
- Particle counts are capped at 320 on desktop, 230 on tablet, and 150 on
  mobile.
- Animation pauses offscreen and when the browser tab is hidden.
- Reduced-motion visitors receive a static render.
- No models, textures, post-processing, bloom, or external requests are used.
