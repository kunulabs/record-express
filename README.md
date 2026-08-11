# Record Express — Landing Page

Static landing page for Record Express (B2B courier & logistics), built from the
[Figma design](https://www.figma.com/design/A21l08qH9T8vGlLo5XcU2W/Record-Express).

Plain HTML/CSS/JS — no build step, so it previews directly on GitHub Pages or
any static host.

## Structure

The site lives in three self-contained variants; the repository root holds only
a small preview index that links to them.

```
index.html         Preview index (links to the three variants)

variant-a/         Current design
variant-b/         Colour-scheme variant
variant-c/         Colour-scheme variant

  index.html       Page markup
  css/style.css    Styles (design tokens, layout, components)
  js/script.js     Mobile nav, quote-bar toggle, section selectors, forms
  assets/images/   Image assets
```

## Colour-scheme variants

Each variant is a complete, independent copy — its own `index.html`, `css/`,
`js/` and `assets/`. Editing one cannot affect the others.

Live previews:

| | URL |
|---|---|
| Index | https://kunulabs.github.io/record-express/ |
| Variant A | https://kunulabs.github.io/record-express/variant-a/ |
| Variant B | https://kunulabs.github.io/record-express/variant-b/ |
| Variant C | https://kunulabs.github.io/record-express/variant-c/ |

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

Note the assets are duplicated per variant, so an image or markup fix must be
applied to all three copies.

## Running locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Note on images

The images are the real exported photography and partner logos, supplied via
Google Drive and direct upload. They cannot be pulled from Figma in this
environment: the egress policy blocks `figma.com`, so `download_assets` URLs
fail even though the design itself can be read through the Figma MCP server.
New or updated artwork therefore has to be uploaded rather than fetched.
