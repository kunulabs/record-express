# Record Express — Landing Page

Static landing page for Record Express (B2B courier & logistics), built from the
[Figma design](https://www.figma.com/design/A21l08qH9T8vGlLo5XcU2W/Record-Express).

Plain HTML/CSS/JS — no build step, so it previews directly on GitHub Pages or
any static host.

## Structure

```
index.html        Page markup
css/style.css      Styles (design tokens, layout, components)
js/script.js       Mobile nav, quote-bar toggle, carousel, form handling
assets/images/     Image assets
```

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
