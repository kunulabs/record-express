# Record Express — Landing Page

Static landing page for Record Express (B2B courier & logistics), built from the
[Figma design](https://www.figma.com/design/A21l08qH9T8vGlLo5XcU2W/Record-Express).

Plain HTML/CSS/JS — no build step, so it previews directly on GitHub Pages or
any static host.

## Structure

```
index.html         Page markup
css/style.css      Styles (design tokens, layout, components)
js/script.js       Mobile nav, quote-bar toggle, section selectors, form handling
assets/images/     Image assets

variant-a/         Standalone copy for colour-scheme exploration
variant-b/         Standalone copy for colour-scheme exploration
```

## Colour-scheme variants

`variant-a/` and `variant-b/` are complete, self-contained copies of the site,
each with its own `index.html`, `css/`, `js/` and `assets/`. Editing one cannot
affect the others.

Live previews:

| | URL |
|---|---|
| Main | https://kunulabs.github.io/record-express/ |
| Variant A | https://kunulabs.github.io/record-express/variant-a/ |
| Variant B | https://kunulabs.github.io/record-express/variant-b/ |

To reskin a variant, edit the design tokens at the top of its `css/style.css` —
the whole palette flows from that one block:

```css
:root {
  --color-bg-default: #fff6eb;   /* page background */
  --color-bg-accent:  #ffe3c2;   /* cards, pills, industry panel */
  --color-bg-dark:    #122114;   /* dark sections, featured service panel */
  --color-text-action:#d55445;   /* eyebrows, numbers, links */
  --color-coral-500:  #ec6655;   /* primary buttons, active rail row */
  --color-coral-700:  #b84437;   /* button hover, icon fills */
}
```

Note the assets are duplicated per variant, so an image fix must be applied to
all three copies.

## Running locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Note on images

The photographic images in this repo are placeholder SVG graphics (branded
gradients + icons), not the final photography from the Figma file — this
environment's network policy blocks direct downloads from figma.com. Replace
the files in `assets/images/` with the real exported photos/logos from Figma
(same filenames) to finish the visual polish. The partner logos in the
"Our Partners" strip are text placeholders for the same reason.
